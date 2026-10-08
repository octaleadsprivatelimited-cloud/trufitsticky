import { scrollToSection } from '../../scroll/smoothScroll';
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { trackCoachEvent } from "../../analytics/analytics";
import Point from "../../assets/card-plan-desc.svg";
import InstagramIcon from "../../assets/social-insta.svg";
import LinkedInIcon from "../../assets/social-linkedin.svg";
import ClientPaymentForm from "./ClientPaymentForm";
import ProgramDescriptionRenderer from "./ProgramDescriptionRenderer";
import ProgramBenefit from "./ProgramBenefit";
import CoachSpecialties from "./CoachSpecialties";
import CoachPortrait from "./CoachPortrait";
import SharedContext from "../../context/SharedContext";
import CouplePlans from "./CouplePlans";
import { fetchCatalog } from "./catalog";

/**
 * CoachCard — public coach profile page.
 *
 * Layout mirrors the Coach.dc reference design (breadcrumb → hero → about →
 * approach/journey/expertise → weekly plans grid → member-feedback marquee →
 * sticky CTA) while staying 100% data-driven: region detection, per-tier
 * pricing, capacity → waitlist, the consultation flow, the payment form and the
 * admin-authored program descriptions are all preserved from the previous
 * implementation. The presentational classes are namespaced `cpx-` (see
 * coachPage.css); the legacy `.card-plan-*` classes are reused only inside the
 * collapsible "What's included" panels via ProgramDescriptionRenderer.
 */
const CoachCard = ({ coach, initialCoupleMode = false, initialPlan = null }) => {
  const [activePlan, setActivePlan] = useState(initialPlan); // landing pages may carry an existing catalogue selection
  const [couplePlans, setCouplePlans] = useState([]);
  const [coupleMode, setCoupleMode] = useState(initialCoupleMode);
  const { countryCode, setCountryCode, locationLoading } = useContext(SharedContext);
  const [loadingLocation, setLoadingLocation] = useState(!countryCode);
  const [showForm, setShowForm] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Waiting list state
  const [showWaitingList, setShowWaitingList] = useState(false);
  const [waitingListData, setWaitingListData] = useState({ name: "", email: "", phone_number: "", details: "" });
  const [waitingListLoading, setWaitingListLoading] = useState(false);
  const [waitingListError, setWaitingListError] = useState("");
  const [waitingListSuccess, setWaitingListSuccess] = useState(false);

  const [siteSettings, setSiteSettings] = useState(null);
  const [planIdMap, setPlanIdMap] = useState({});
  const [analyticsPlanIds, setAnalyticsPlanIds] = useState({});
  const [coachingPlanNames, setCoachingPlanNames] = useState([]);

  // Controlled "What's included" panel: expanded by default; the hero "Check
  // what's included here" link scrolls to it and the user can still toggle it.
  const [includedOpen, setIncludedOpen] = useState(true);
  const includedRef = useRef(null);
  const allPlansCloseRef = useRef(null);

  // Global testimonials (site-wide) that power the member-feedback marquee.
  const [testimonials, setTestimonials] = useState([]);

  // Lookup table: `${level}:${location}:${duration_weeks ?? "consult"}` -> bool.
  // Used to decide whether to show the "Recommended" badge on a plan card.
  const [recommendedMap, setRecommendedMap] = useState({});

  // Dynamic program descriptions (admin-authored). `descriptionDocs` holds the
  // two global default block documents ({ coaching, consultation }); the
  // per-plan overrides are keyed by `${level}:${location}:${duration}`.
  const [descriptionDocs, setDescriptionDocs] = useState({ coaching: null, consultation: null });
  const [planBlocksMap, setPlanBlocksMap] = useState({});

  // True once the visitor manually selects a plan. Stops the auto-default and
  // region-sync effects from overriding their choice.
  const userPickedRef = useRef(Boolean(initialPlan));

  const navigate = useNavigate();
  const baseUrl = coach?.livePreview ? '/catalog-preview' : import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const controller = new AbortController();
    fetchCatalog("couple-plans", controller.signal)
      .then(data => setCouplePlans(Array.isArray(data) ? data : []))
      .catch(() => { /* An unavailable optional catalogue never blocks individual plans. */ });
    return () => controller.abort();
  }, []);

  // Populated by the plans fetch, keyed by tier slug (see newPricing).
  const pricingRef = useRef({});

  useEffect(() => {
    if (!showAllPlans) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setShowAllPlans(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    allPlansCloseRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAllPlans]);

  // Fetch site settings, plans and program content.
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const [settingsRes, plansRes, contentRes] = await Promise.all([
          fetch(`${baseUrl}/admin_functions/site-settings/`),
          fetch(`${baseUrl}/admin_functions/plans/`),
          // Decoupled: a network/CORS-level rejection of the optional content
          // endpoint must NOT reject the Promise.all and discard the critical
          // settings/plans responses. On any failure this resolves to null and
          // the renderer uses the legacy copy.
          fetch(`${baseUrl}/admin_functions/program-content/`).catch(() => null),
        ]);

        if (settingsRes.ok) {
          setSiteSettings(await settingsRes.json());
        }

        // Global default program-description documents (coaching / consultation).
        if (contentRes && contentRes.ok) {
          try {
            const docs = await contentRes.json();
            const byKey = { coaching: null, consultation: null };
            (Array.isArray(docs) ? docs : []).forEach((d) => {
              if (d && (d.key === "coaching" || d.key === "consultation")) {
                byKey[d.key] = Array.isArray(d.blocks) ? d.blocks : null;
              }
            });
            setDescriptionDocs(byKey);
          } catch (e) {
            console.error("Error parsing program content:", e);
          }
        }

        if (plansRes.ok) {
          const plansData = await plansRes.json();
          const newPricing = {};

          // Coaching durations for THIS coach's level only.
          const coachLvl = coach?.coach_level?.toLowerCase();
          const coachSpecificPlans = plansData.filter(
            (p) => p.category?.coach_level?.toLowerCase() === coachLvl && p.duration_weeks
          );
          const coachingDurations = [...new Set(coachSpecificPlans.map((p) => p.duration_weeks))].sort((a, b) => a - b);
          const dynamicPlanNames = coachingDurations.map((d) => `${d} weeks`);
          setCoachingPlanNames(dynamicPlanNames);

          // planIdMap: "X weeks" -> plan slot 2, 3, ...
          const idMap = { "Consultation Call": 1 };
          coachingDurations.forEach((d, i) => { idMap[`${d} weeks`] = i + 2; });
          setPlanIdMap(idMap);

          // Default to the admin-recommended coaching plan.
          if (!activePlan && dynamicPlanNames.length > 0) {
            const recommendedForRegion = coachSpecificPlans
              .filter((p) => p.recommended && (!countryCode || p.category?.location?.toUpperCase() === countryCode))
              .map((p) => p.duration_weeks);
            const anyRecommended = coachSpecificPlans
              .filter((p) => p.recommended)
              .map((p) => p.duration_weeks);
            const pool = recommendedForRegion.length ? recommendedForRegion : anyRecommended;
            if (pool.length) {
              setActivePlan(`${Math.max(...pool)} weeks`);
            } else {
              setActivePlan(dynamicPlanNames[dynamicPlanNames.length - 1]);
            }
          } else if (!activePlan && dynamicPlanNames.length === 0) {
            setActivePlan("Consultation Call");
          }

          const newRecommendedMap = {};
          const publicPlanIds = {};
          const newPlanBlocksMap = {};

          plansData.forEach((plan) => {
            if (!plan.category) return;
            const level = plan.category.coach_level?.toLowerCase();
            const location = plan.category.location?.toUpperCase();
            let planType = null;
            if (!plan.duration_weeks) planType = "Consultation Call";
            else planType = `${plan.duration_weeks} weeks`;

            if (level && location && planType) {
              if (!newPricing[level]) newPricing[level] = { DOMESTIC: {}, INTERNATIONAL: {} };
              if (newPricing[level][location]) {
                const symbol = location === "DOMESTIC" ? "₹" : "$";
                const formattedPrice = Number(plan.price).toLocaleString();
                newPricing[level][location][planType] = `${symbol} ${formattedPrice}`;
              }
            }

            if (level && location) {
              const durKey = plan.duration_weeks || "consult";
              publicPlanIds[`${level}:${location}:${durKey}`] = String(plan.id);
              newRecommendedMap[`${level}:${location}:${durKey}`] = !!plan.recommended;

              if (plan.duration_weeks) {
                const blocks = Array.isArray(plan.description_blocks) && plan.description_blocks.length
                  ? plan.description_blocks
                  : null;
                newPlanBlocksMap[`${level}:${location}:${plan.duration_weeks}`] = blocks;
              }
            }
          });

          setAnalyticsPlanIds(publicPlanIds);
          setRecommendedMap(newRecommendedMap);
          setPlanBlocksMap(newPlanBlocksMap);

          pricingRef.current = newPricing;
          // Force a re-render to update price display if needed.
          setSiteSettings((prev) => ({ ...prev }));
        }
      } catch (err) {
        console.error("Error fetching dynamic data:", err);
      }
    };

    fetchDynamicData();
    // activePlan/countryCode are intentionally excluded: including them would
    // re-fetch plans on every region switch or plan selection. The region-sync
    // effect below keeps the active plan aligned when countryCode changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, coach]);

  // Global testimonials for the member-feedback marquee. Failure is non-fatal:
  // the section simply hides when there are none.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/admin_functions/testimonials/`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setTestimonials(Array.isArray(data) ? data : (data.results || []));
      } catch (err) {
        if (import.meta.env.DEV) console.error("Error fetching testimonials:", err);
      }
    })();
    return () => { cancelled = true; };
  }, [baseUrl]);

  // Keep the highlighted plan in sync with the admin "Recommended" flag for the
  // visitor's resolved region. Never overrides a manual selection.
  useEffect(() => {
    if (userPickedRef.current) return;
    if (!coach || !countryCode || coachingPlanNames.length === 0) return;
    const lvl = coach.coach_level?.toLowerCase();
    if (!lvl) return;
    const recommendedDurations = coachingPlanNames
      .map((n) => { const m = n.match(/\d+/); return m ? Number(m[0]) : null; })
      .filter((d) => d !== null && recommendedMap[`${lvl}:${countryCode}:${d}`]);
    if (recommendedDurations.length > 0) {
      setActivePlan(`${Math.max(...recommendedDurations)} weeks`);
    }
  }, [countryCode, recommendedMap, coachingPlanNames, coach]);

  // Track whether Consultation Call is actually bookable.
  const [consultationAvailable, setConsultationAvailable] = useState(true);

  // Consultation is always shown; this only toggles its availability.
  useEffect(() => {
    if (!coach || !countryCode || !siteSettings) return;

    const coachEnabled = countryCode === "DOMESTIC"
      ? coach.domestic_consultation_enabled !== false
      : coach.international_consultation_enabled !== false;

    const regionEnabled = countryCode === "DOMESTIC"
      ? siteSettings.domestic_consultation_enabled
      : siteSettings.international_consultation_enabled;

    setConsultationAvailable(coachEnabled && regionEnabled);
  }, [coach, countryCode, siteSettings]);

  // Sync loading state with SharedContext's locationLoading.
  useEffect(() => {
    if (countryCode) {
      setLoadingLocation(false);
      setShowRegionSelector(false);
    } else if (!locationLoading && !countryCode) {
      setLoadingLocation(false);
      setShowRegionSelector(true);
    } else {
      setLoadingLocation(locationLoading);
    }
  }, [countryCode, locationLoading]);

  // Manual region handler.
  const handleManualRegionSelect = (region) => {
    const code = region === "india" ? "DOMESTIC" : "INTERNATIONAL";
    if (setCountryCode) setCountryCode(code);
    setShowRegionSelector(false);
    setLocationError("");
  };

  if (!coach) return null;

  const coachLevel = coach.coach_level?.toLowerCase();
  const activeCouplePlans = couplePlans.filter(plan => plan.is_active !== false && Number(plan.price) > 0 && Number(plan.duration_weeks) > 0 && plan.category?.coach_level?.toLowerCase() === coach.coach_level?.toLowerCase() && plan.category?.location?.toLowerCase() === (countryCode === "DOMESTIC" ? "domestic" : "international")).sort((a,b) => Number(a.duration_weeks) - Number(b.duration_weeks));
  const isCoupleMode = coupleMode;
  const currencySymbol = countryCode === "INTERNATIONAL" ? "$" : "₹";
  const firstName = (coach.name || "").trim().split(/\s+/)[0] || "your coach";

  // Price for the currently-selected plan (drives the payment form amount).
  let price = pricingRef.current[coachLevel]?.[countryCode]?.[activePlan] || "Price not available";
  if (activePlan === "Consultation Call") {
    const customPrice = countryCode === "DOMESTIC" ? coach.domestic_consultation_price : coach.international_consultation_price;
    if (customPrice && Number(customPrice) > 0) {
      price = `${currencySymbol} ${Number(customPrice).toLocaleString()}`;
    }
  }

  // Price for an arbitrary plan (used by the pricing grid cards).
  const priceFor = (plan) => {
    let p = pricingRef.current[coachLevel]?.[countryCode]?.[plan] || null;
    if (plan === "Consultation Call") {
      const custom = countryCode === "DOMESTIC" ? coach.domestic_consultation_price : coach.international_consultation_price;
      if (custom && Number(custom) > 0) {
        p = `${currencySymbol} ${Number(custom).toLocaleString()}`;
      }
    }
    return p;
  };

  const weeklyRateForPlan = (plan) => {
    const total = priceFor(plan);
    const weeksMatch = String(plan || "").match(/\d+/);
    const totalAmount = total
      ? Number(String(total).replace(/[^0-9.]/g, ""))
      : 0;
    const weeks = weeksMatch ? Number(weeksMatch[0]) : 0;
    return totalAmount > 0 && weeks > 0 ? totalAmount / weeks : null;
  };

  const selectedWeeklyRate = activePlan && activePlan !== "Consultation Call"
    ? weeklyRateForPlan(activePlan)
    : null;
  const selectedWeeklyPrice = selectedWeeklyRate
    ? `${currencySymbol}${Math.round(selectedWeeklyRate).toLocaleString()}`
    : null;

  // ---- Capacity helpers (per plan + region) ---------------------------------
  const isPlanTabFull = (plan) => {
    const dynamicCaps = coach.dynamic_capacities;
    if (coach.preview || !dynamicCaps || !countryCode || plan === "Consultation Call") return false;
    const durMatch = plan.match(/\d+/);
    if (!durMatch) return false;
    const loc = countryCode === "DOMESTIC" ? "domestic" : "international";
    const info = dynamicCaps[durMatch[0]]?.[loc];
    return !!(info && info.max !== null && info.current >= info.max);
  };

  const getRemainingSlotsForPlan = (plan) => {
    const dynamicCaps = coach.dynamic_capacities;
    if (!dynamicCaps || !countryCode || plan === "Consultation Call") return null;
    const durMatch = plan.match(/\d+/);
    if (!durMatch) return null;
    const loc = countryCode === "DOMESTIC" ? "domestic" : "international";
    const info = dynamicCaps[durMatch[0]]?.[loc];
    if (!info || info.max === null || info.max === undefined) return null;
    return Math.max(0, info.max - (info.current || 0));
  };

  const isPlanRecommended = (plan) => {
    if (!coach || !countryCode) return false;
    const lvl = coach.coach_level?.toLowerCase();
    let durKey;
    if (plan === "Consultation Call") durKey = "consult";
    else { const m = plan.match(/\d+/); durKey = m ? Number(m[0]) : null; }
    if (!lvl || durKey === null || durKey === undefined) return false;
    return !!recommendedMap[`${lvl}:${countryCode}:${durKey}`];
  };

  // Analytics uses catalogue IDs; the existing payment API uses legacy plan slots.
  const analyticsPlanFields = (plan) => {
    const weeks = Number(String(plan).match(/\d+/)?.[0]) || 0;
    return { plan_id: analyticsPlanIds[`${coachLevel}:${countryCode}:${weeks || 'consult'}`], plan_type: plan === 'Consultation Call' ? 'consultation' : 'individual', duration_weeks: weeks, pricing_region: countryCode, value: Number(String(priceFor(plan) || '').replace(/[^0-9.]/g, '')), currency: countryCode === 'DOMESTIC' ? 'INR' : 'USD' };
  };

  // ---- Actions --------------------------------------------------------------
  const selectPlan = (plan) => {
    trackCoachEvent("select_plan", coach, analyticsPlanFields(plan));
    userPickedRef.current = true;
    setActivePlan(plan);
    setShowAllPlans(false);
  };

  const joinWaitlist = (plan) => {
    if (coach.preview) return;
    userPickedRef.current = true;
    setActivePlan(plan);
    setShowWaitingList(true);
  };

  // Sticky CTA: enroll with the currently-selected plan — opens the payment
  // form directly (the separate plan-selection page has been removed). If no
  // plan is priced yet (region unresolved), nudge the visitor to the plans grid.
  const goEnroll = () => {
    if (coach.preview) return;
    if (isCoupleMode) {
      scrollToSection(document.getElementById('cpx-plans'));
      return;
    }
    if (activePlan && isPlanTabFull(activePlan)) {
      joinWaitlist(activePlan);
    } else if (activePlan === "Consultation Call" && !consultationAvailable) {
      navigate("/coaches");
    } else if (activePlan && price && price !== "Price not available") {
      trackCoachEvent("begin_checkout", coach, analyticsPlanFields(activePlan));
      setShowForm(true);
    } else {
      const el = document.getElementById("cpx-plans");
      scrollToSection(el);
    }
  };

  // ---- Derived program-description blocks -----------------------------------
  const activeDurationWeeks = (() => {
    if (!activePlan || activePlan === "Consultation Call") return null;
    const m = String(activePlan).match(/\d+/);
    return m ? Number(m[0]) : null;
  })();

  const coachLevelKey = coach?.coach_level?.toLowerCase();
  const planOverrideBlocks = (coachLevelKey && countryCode && activeDurationWeeks)
    ? planBlocksMap[`${coachLevelKey}:${countryCode}:${activeDurationWeeks}`]
    : null;
  const resolvedCoachingBlocks = planOverrideBlocks || descriptionDocs.coaching;
  const resolvedConsultationBlocks = descriptionDocs.consultation;

  // ---- Presentational data --------------------------------------------------
  const coachLevelName = (() => {
    const label = String(coach.coach_level_name || "").trim();
    if (!label) return "";
    if (label !== label.toUpperCase()) return label;
    return label
      .toLowerCase()
      .replace(/(^|[\s-])([a-z])/g, (_match, separator, letter) => (
        `${separator}${letter.toUpperCase()}`
      ));
  })();
  const specializations = (coach.specializations || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);


  const years = (() => {
    const m = String(coach.experience_details || "").match(/(\d+)\s*\+?\s*year/i);
    return m ? m[1] : null;
  })();
  const levelLabel = coachLevelName
    ? `${coachLevelName} coach`
    : null;
  const statItems = [];
  if (levelLabel) statItems.push({ strong: true, star: true, text: levelLabel });
  if (years) statItems.push({ text: `${years} yrs experience` });

  const certChips = Array.isArray(coach.certifications)
    ? coach.certifications.map((c) => c.certificate).filter(Boolean)
    : [];

  // Reviews: duplicate the list so the marquee loops seamlessly.
  const marqueeReviews = testimonials.length ? [...testimonials, ...testimonials] : [];
  const marqueeDuration = `${Math.max(30, testimonials.length * 7)}s`;

  // ---- Renderers for the collapsible program details ------------------------
  const renderCoachingDetails = () =>
    resolvedCoachingBlocks && resolvedCoachingBlocks.length ? (
      <ProgramDescriptionRenderer blocks={resolvedCoachingBlocks} />
    ) : (
      <>
        <div className="card-plan-det">
          <p className="card-plan-title">Program Inclusions</p>
          <div className="card-plan-desc-sec">
            <div className="card-plan-desc">
              <span className="card-plan-desc-text">
                Your Tru Fit coaching experience combines personalized guidance from your coach with our AI-powered client app, giving you everything you need to stay consistent, accountable, and on track.
              </span>
            </div>
          </div>
          <div className="card-plan-desc-sec">
            <div className="card-plan-desc">
              <span className="card-plan-desc-text">With your coaching program, you'll receive:</span>
            </div>
          </div>
          <div className="card-plan-desc-sec"><ProgramBenefit title="Customized Nutrition Plan">Tailored meal options and guidelines based on your dietary preferences, lifestyle, and fitness goals.</ProgramBenefit></div>
          <div className="card-plan-desc-sec"><ProgramBenefit title="Personalized Training Plan">A workout plan designed around your schedule, training experience, available equipment, and objectives.</ProgramBenefit></div>
          <div className="card-plan-desc-sec"><ProgramBenefit title="Weekly Progress Reviews">Your coach will review your updates weekly and make adjustments to ensure steady progress.</ProgramBenefit></div>
          <div className="card-plan-desc-sec"><ProgramBenefit title="Plan Modifications">Your coach will update or modify your plan as needed to optimize results.</ProgramBenefit></div>
          <div className="card-plan-desc-sec"><ProgramBenefit title="Ongoing Support">Communicate with your coach through the Tru Fit app, email, and scheduled check-ins. Coaches respond within 24 working hours.</ProgramBenefit></div>
          <div className="card-plan-desc-sec"><ProgramBenefit title="AI-Powered Client App">You will also get access to our AI-powered coaching app, your all-in-one hub for your fitness journey.</ProgramBenefit></div>
          <div className="card-plan-desc-sec">
            <div className="card-plan-desc">
              <p className="card-plan-title" style={{ marginBottom: "8px" }}>Inside the app, you can:</p>
            </div>
          </div>
          {[
            "Communicate directly with your coach",
            "Receive and view your training and nutrition plans",
            "Update your progress and metrics",
            "Track habits, workouts, and consistency",
            "Access personalized recommendations enhanced by AI",
          ].map((t) => (
            <div className="card-plan-desc-sec" key={t}>
              <img src={Point} alt="" />
              <div className="card-plan-desc">
                <span className="card-plan-desc-text">{t}</span>
              </div>
            </div>
          ))}
          <div className="card-plan-desc-sec">
            <div className="card-plan-desc">
              <span className="card-plan-desc-text">
                Everything you need is in one place, simple, structured, and tailored to you.
              </span>
            </div>
          </div>
        </div>

        <div className="card-plan-det">
          <p className="card-plan-title">What happens after the payment?</p>
          <div className="card-plan-desc-sec"><ProgramBenefit title="Fill Out Your Intake Form">After completing your payment, the website will redirect you to a form where you'll provide essential details about your goals, lifestyle, preferences, and health background.</ProgramBenefit></div>
          <div className="card-plan-desc-sec"><ProgramBenefit title="Coach Assignment &amp; Review">Once you submit the form, your selected coach will receive your details and review your goals.</ProgramBenefit></div>
          <div className="card-plan-desc-sec"><ProgramBenefit title="Coach Contact (Within 1–2 Working Days)">Your coach will reach out within 1–2 working days to introduce themselves, clarify your goals if needed, and guide you through the onboarding process.</ProgramBenefit></div>
          <div className="card-plan-desc-sec"><ProgramBenefit title="Program Creation &amp; Delivery">Your customized training and nutrition program will be created and delivered inside the Tru Fit app.</ProgramBenefit></div>
          <div className="card-plan-desc-sec"><ProgramBenefit title="Start Your Program">Begin your journey with full support from your coach and AI-powered tools to help you stay accountable and progress efficiently.</ProgramBenefit></div>
        </div>

        <div className="card-plan-det">
          <div className="card-plan-desc-sec">
            <div className="card-plan-desc">
              <span className="card-plan-desc-text">
                For more information, refer to our{" "}
                <a href="/terms-conditions" style={{ color: "#9c27ff", textDecoration: "underline" }}>Terms & Conditions</a>
              </span>
            </div>
          </div>
        </div>
      </>
    );

  const renderConsultationDetails = () =>
    resolvedConsultationBlocks && resolvedConsultationBlocks.length ? (
      <ProgramDescriptionRenderer blocks={resolvedConsultationBlocks} />
    ) : (
      <div className="card-plan-det">
        <p className="card-plan-title">In your 20-minute one-on-one consultation, you'll connect directly with one of our expert coaches to:</p>
        {[
          "Discuss your fitness goals and challenges",
          "Understand how Tru Fit's coaching works",
          "Get initial guidance on structuring your fitness journey",
        ].map((t) => (
          <div className="card-plan-desc-sec" key={t}>
            <img src={Point} alt="" />
            <div className="card-plan-desc">
              <span className="card-plan-desc-text">{t}</span>
            </div>
          </div>
        ))}
        <div className="card-plan-desc-sec">
          <div className="card-plan-desc">
            <span className="card-plan-desc-text">
              This call is perfect for those exploring whether a full coaching program is the right fit for their goals.
            </span>
          </div>
        </div>

        <div className="card-plan-det">
          <p className="card-plan-title">What happens after the payment?</p>
          <div className="card-plan-desc-sec">
            <img src={Point} alt="" />
            <div className="card-plan-desc">
              <p className="card-plan-desc-title">Schedule Instantly:<span className="card-plan-desc-text">
                {" "}Once your payment is complete, you'll be automatically redirected to our Calendly page to schedule your consultation slot with your chosen coach.
              </span></p>
            </div>
          </div>
          <div className="card-plan-desc-sec">
            <img src={Point} alt="" />
            <div className="card-plan-desc">
              <p className="card-plan-desc-title">Confirm Your Booking:<span className="card-plan-desc-text">
                {" "}You'll receive a confirmation email with the meeting details and a calendar invite.
              </span></p>
            </div>
          </div>
          <div className="card-plan-desc-sec">
            <img src={Point} alt="" />
            <div className="card-plan-desc">
              <p className="card-plan-desc-title">Meet Your Coach:<span className="card-plan-desc-text">
                {" "}At your chosen time, join your 1-on-1 consultation to discuss your fitness goals, questions, and next steps.
              </span></p>
            </div>
          </div>
        </div>

        <div className="card-plan-det">
          <p className="card-plan-title">Important Information</p>
          <div className="card-plan-desc-sec">
            <img src={Point} alt="" />
            <div className="card-plan-desc">
              <span className="card-plan-desc-text">
                This is a <span className="card-plan-desc-title">one-time payment</span> for a single consultation session.
              </span>
            </div>
          </div>
          <div className="card-plan-desc-sec">
            <img src={Point} alt="" />
            <div className="card-plan-desc">
              <span className="card-plan-desc-text">
                <span className="card-plan-desc-title">No refunds</span> are provided for consultation calls.
              </span>
            </div>
          </div>
          <div className="card-plan-desc-sec">
            <img src={Point} alt="" />
            <div className="card-plan-desc">
              <span className="card-plan-desc-text">
                Please ensure you're available at your selected time and have a stable network connection.
              </span>
            </div>
          </div>
        </div>

        <div className="card-plan-det">
          <div className="card-plan-desc-sec">
            <div className="card-plan-desc">
              <span className="card-plan-desc-text">
                For more information, refer to our{" "}
                <a href="/terms-conditions" style={{ color: "#9c27ff", textDecoration: "underline" }}>Terms & Conditions</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );

  // ---- Compact plan pills ---------------------------------------------------
  const renderCoachingPill = (plan) => {
    const cardPrice = priceFor(plan);
    const durMatch = plan.match(/\d+/);
    const weeks = durMatch ? durMatch[0] : "";
    const full = isPlanTabFull(plan);
    const recommended = isPlanRecommended(plan);
    const remaining = getRemainingSlotsForPlan(plan);
    const isActive = activePlan === plan;

    return (
      <button
        type="button"
        key={plan}
        className={[
          "cpx-plan-pill",
          recommended ? "cpx-plan-pill--recommended" : "",
          isActive ? "cpx-plan-pill--active" : "",
          full ? "cpx-plan-pill--full" : "",
        ].filter(Boolean).join(" ")}
        onClick={() => selectPlan(plan)}
        aria-pressed={isActive}
        aria-label={`${weeks ? `${weeks} week coaching plan` : plan}${isActive ? ", selected" : ""}`}
      >
        {recommended && <span className="cpx-plan-pill-badge">Coach recommended</span>}
        <span className="selection-dot" aria-hidden="true"/>
        <span className="cpx-plan-pill-topline">
          <span className="cpx-plan-pill-name">{weeks ? `${weeks} Weeks` : plan}</span>
        </span>
        <span className="cpx-plan-pill-mobile-label" aria-hidden="true">
          <strong>{weeks || plan}</strong>
          <span>{weeks ? "week" : "coaching"}</span>
        </span>
        <span className="package-card-caption">{Number(weeks) <= 12 ? 'Build your foundation' : Number(weeks) <= 24 ? 'Find your rhythm' : 'Keep moving forward'}</span>
        <span className="cpx-plan-pill-price">
          {cardPrice || "Unavailable"}
          {cardPrice && <small> total</small>}
        </span>
        {weeklyRateForPlan(plan) && <span className="package-card-weekly">About {currencySymbol}{Math.round(weeklyRateForPlan(plan)).toLocaleString()} / week</span>}
        {full ? (
          <span className="cpx-plan-pill-status cpx-plan-pill-status--full">Join waitlist</span>
        ) : remaining !== null && remaining > 0 && remaining <= 3 ? (
          <span className="cpx-plan-pill-status">{remaining} slot{remaining === 1 ? "" : "s"} left</span>
        ) : null}
      </button>
    );
  };

  // Consultation is the final plan in the same responsive flow as weekly plans.
  const renderConsultationPill = () => {
    const cPrice = priceFor("Consultation Call");
    const isActive = activePlan === "Consultation Call";
    const recommended = isPlanRecommended("Consultation Call");
    return (
      <button
        type="button"
        key="Consultation Call"
        className={[
          "cpx-plan-pill",
          "cpx-plan-pill--consultation",
          recommended ? "cpx-plan-pill--recommended" : "",
          isActive ? "cpx-plan-pill--active" : "",
          !consultationAvailable ? "cpx-plan-pill--unavailable" : "",
        ].filter(Boolean).join(" ")}
        onClick={() => selectPlan("Consultation Call")}
        aria-pressed={isActive}
        aria-label={`20 minute consultation call${isActive ? ", selected" : ""}`}
      >
        {recommended && <span className="cpx-plan-pill-badge">Coach recommended</span>}
        <span className="selection-dot" aria-hidden="true"/>
        <span className="cpx-plan-pill-topline">
          <span className="cpx-plan-pill-name">Consultation Call</span>
        </span>
        <span className="cpx-plan-pill-mobile-label" aria-hidden="true">
          <strong>20</strong>
          <span>min call</span>
        </span>
        <span className="cpx-plan-pill-price">
          {cPrice || "Unavailable"}
          {cPrice && <small> one-time</small>}
        </span>
        <span className="cpx-plan-pill-status">
          {consultationAvailable ? `20 min with ${firstName}` : "Not available"}
        </span>
      </button>
    );
  };

  const hasCoachingPlans = coachingPlanNames.length > 0;
  const hasAdditionalPlans = coachingPlanNames.length > 6;
  const inlineCoachingPlanNames = hasAdditionalPlans
    ? coachingPlanNames.slice(0, 6)
    : coachingPlanNames;
  // Sticky bar reflects the plan currently picked in the plans grid.
  const prettyPlan = (plan) =>
    plan === "Consultation Call"
      ? "Consultation call"
      : String(plan || "").replace(" weeks", "-week program");
  const hasSelectedPrice = !!activePlan && !!price && price !== "Price not available";
  const selectedPlanFull = !!activePlan && isPlanTabFull(activePlan);
  const selectedActionLabel = selectedPlanFull
    ? "Join waitlist"
    : activePlan === "Consultation Call"
      ? (consultationAvailable ? "Book consultation" : "View other coaches")
      : "Enroll now";

  return (
    <div className="cpx-page">
      {/* HERO */}
      <header id="coach-overview" tabIndex={-1} className="cpx-pad">
        <div className="cpx-hero">
          <span className="profile-sticker">A human in your corner ↗</span>
          <div className="cpx-hero-portrait">
            <CoachPortrait coach={coach} />
          </div>
          <div>
            <p className="cpx-eyebrow">Your coach</p>
            <div className="cpx-name-row">
              <h1 className="cpx-name">{coach.name}</h1>
              {(coach.insta_link || coach.linkedin_link) && (
                <div className="cpx-socials cpx-socials--inline">
                  {coach.insta_link && (
                    <a href={coach.insta_link} target="_blank" rel="noreferrer" aria-label="Instagram">
                      <img src={InstagramIcon} alt="Instagram" style={{ width: 18, height: 18 }} />
                    </a>
                  )}
                  {coach.linkedin_link && (
                    <a href={coach.linkedin_link} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                      <img src={LinkedInIcon} alt="LinkedIn" style={{ width: 18, height: 18 }} />
                    </a>
                  )}
                </div>
              )}
            </div>
            <CoachSpecialties value={coach.specializations} />
            {coach.location && <p className="cpx-subtitle">{coach.location}</p>}
            {statItems.length > 0 && (
              <div className="cpx-stats">
                {statItems.map((s, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="cpx-dot">•</span>}
                    <span className={s.strong ? "cpx-strong" : ""}>
                      {s.star ? "★ " : ""}{s.text}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}
            <a className="profile-plan-link" href="#cpx-plans">Explore coaching plans <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </header>
      <nav className="profile-section-nav cpx-pad" aria-label="Coach profile sections"><a href="#cpx-plans">Coaching plans</a><a href="#coach-about">About {firstName}</a><a href="#coach-next">Getting started</a></nav>

      {/* WEEKLY PLANS */}
      <section className="cpx-section" id="cpx-plans" tabIndex={-1}>
        {coach.preview && !coach.livePreview && <div className="cpx-pad catalogue-note"><strong>Your coaching plan</strong><p>Personalized workouts, nutrition guidance, and regular check-ins. Connect the backend to view current plans and subscription prices.</p></div>}
        <div className="cpx-pad">
          <div className="package-heading" data-reveal><div><p className="eyebrow">Your next chapter starts here</p><h2>FIND YOUR <em>KIND OF PLAN.</em></h2></div><p>Clear options. A price up front.<br/>Support built around your everyday.</p></div>
          <div className="package-type-head"><p className="package-step"><span>01</span> Choose who’s joining</p>{countryCode && !loadingLocation && <label className="package-region">Pricing region<select value={countryCode} onChange={event => handleManualRegionSelect(event.target.value === 'DOMESTIC' ? 'india' : 'international')}><option value="DOMESTIC">India · INR</option><option value="INTERNATIONAL">International · USD</option></select></label>}</div>
          <div className="couple-mode-switch" aria-label="Coaching package">
            <button type="button" aria-pressed={!isCoupleMode} onClick={() => { setCoupleMode(false); trackCoachEvent('plan_interest', coach, { plan_type: 'individual', pricing_region: countryCode }); }}><span className="package-person-icon" aria-hidden="true">01</span><span><strong>Individual</strong><small>A plan built just for you</small></span><span className="selection-dot" aria-hidden="true"/></button>
            <button type="button" aria-pressed={isCoupleMode} onClick={() => { setCoupleMode(true); trackCoachEvent('plan_interest', coach, { plan_type: 'couple', pricing_region: countryCode }); }}><span className="package-person-icon" aria-hidden="true">02</span><span><strong>Couple</strong><small>Two people. Individual goals.</small></span><span className="selection-dot" aria-hidden="true"/></button>
          </div>
          {loadingLocation ? <p className="cpx-plan-selector-loading" role="status">Finding your pricing region…</p> : (!countryCode || showRegionSelector) ? <div className="cpx-region"><p>Select your region to view pricing</p><div className="cpx-region-btns"><button type="button" onClick={() => handleManualRegionSelect('india')}>India · INR</button><button type="button" onClick={() => handleManualRegionSelect('international')}>International · USD</button></div>{locationError && <p role="alert">{locationError}</p>}</div> : isCoupleMode ? <CouplePlans coach={coach} plans={activeCouplePlans} region={countryCode} /> : (
            <div className="cpx-plan-selector" hidden={coach.preview && !coach.livePreview}>
              <p className="package-step"><span>02</span> Choose your timeline</p>
              <div className="package-body">
                <div className="package-options"><div className="cpx-plan-pill-row">
                  {hasCoachingPlans && inlineCoachingPlanNames.map(plan => renderCoachingPill(plan))}
                  {renderConsultationPill()}
                </div>{hasAdditionalPlans && <button type="button" className="cpx-see-all-plans" onClick={() => setShowAllPlans(true)} aria-haspopup="dialog"><span>See all plans</span><small>{coachingPlanNames.length} weekly options</small></button>}</div>
                <aside className="cpx-selected-summary" aria-label="Selected plan summary" aria-live="polite">
                  <p className="eyebrow">Your plan at a glance</p><h3>{activePlan === 'Consultation Call' ? 'Let’s start with a conversation.' : `${String(activePlan || 'Your plan').replace(' weeks', '-week coaching')}`}</h3><p className="summary-coach">Individual · with {firstName}</p>
                  <p className="summary-price">{hasSelectedPrice ? price : '—'}{hasSelectedPrice && <small> total</small>}</p>
                  <p className="summary-rate">{activePlan === 'Consultation Call' ? 'One 20-minute consultation' : selectedWeeklyPrice ? `About ${selectedWeeklyPrice} / week` : 'Select a priced plan to continue'}</p>
                  <ul className="summary-inclusions">{(activePlan === 'Consultation Call' ? ['Talk through your goals', 'Meet your coach', 'Understand your next steps'] : ['Personalized workouts', 'Nutrition guidance', 'Regular check-ins', 'Ongoing coach support']).map(item => <li key={item}>{item}</li>)}</ul>
                  <button type="button" className="cpx-plan-selector-action" disabled={!hasSelectedPrice || coach.preview} onClick={goEnroll}>{coach.preview ? 'Booking disabled in preview' : selectedActionLabel} <span aria-hidden="true">↗</span></button>
                  <p className="summary-note">{activePlan === 'Consultation Call' ? 'A single consultation. Schedule your call after payment.' : 'One payment. A fixed-duration program. No automatic renewal.'}</p>
                </aside>
              </div>
            </div>
          )}

          {/* Collapsible "What's included" — full width so it aligns with the
              About panel below; expanded by default. */}
          {!isCoupleMode && !loadingLocation && countryCode && !showRegionSelector && activePlan && (
            <details
              className="cpx-collapse included-design"
              id="coach-included"
              tabIndex={-1}
              ref={includedRef}
              open={includedOpen}
              onToggle={(e) => setIncludedOpen(e.currentTarget.open)}
            >
              <summary>
                <span className="included-summary-copy"><small>Support from day one</small><span>What’s included</span></span>
                <span className="included-plan-badge">{activePlan !== "Consultation Call" ? String(activePlan).replace(" weeks", "-week program") : "20-minute consultation"}</span>
              </summary>
              <div className="cpx-collapse-body">
                {activePlan === "Consultation Call" ? renderConsultationDetails() : renderCoachingDetails()}
              </div>
            </details>
          )}
        </div>
      </section>

      {/* ABOUT & EXPERTISE — merged into one collapsible panel, stacked tightly
          right under the "What's included" panel (no big inter-section gap). */}
      {(coach.bio || coach.previous_work || certChips.length > 0 || specializations.length > 0) && (
        <section className="cpx-section cpx-section--stack" id="coach-about" tabIndex={-1}>
          <div className="cpx-pad">
            <details className="cpx-collapse">
              <summary>About {firstName} &amp; expertise</summary>
              <div className="cpx-collapse-body cpx-about-body">
                {(coach.bio || coach.previous_work || certChips.length > 0) && (
                  <div className="cpx-about-block">
                    <p className="cpx-label">About</p>
                    <div className="cpx-body">
                      {coach.bio && <p>{coach.bio}</p>}
                      {coach.previous_work && <p>{coach.previous_work}</p>}
                    </div>
                    {certChips.length > 0 && (
                      <div className="cpx-chips">
                        {certChips.map((c, i) => <span className="cpx-chip" key={i}>{c}</span>)}
                        {years && <span className="cpx-chip">{years} yrs coaching</span>}
                      </div>
                    )}
                  </div>
                )}
                {specializations.length > 0 && (
                  <div className="cpx-about-block">
                    <p className="cpx-label">Expertise</p>
                    <div className="cpx-chips" style={{ marginTop: 0 }}>
                      {specializations.map((s, i) => <span className="cpx-chip" key={i}>{s}</span>)}
                    </div>
                    {coach.location && (
                      <p className="cpx-subtitle" style={{ marginTop: 16 }}>Based in {coach.location}</p>
                    )}
                  </div>
                )}
              </div>
            </details>
          </div>
        </section>
      )}

      {/* MEMBER FEEDBACK — auto-scroll marquee */}
      {marqueeReviews.length > 0 && (
        <section className="cpx-feedback">
          <div className="cpx-feedback-head">
            <p className="cpx-eyebrow" style={{ color: "#9e93b8" }}>Member feedback</p>
            <h2 className="cpx-h2">In their words</h2>
          </div>
          <div className="cpx-marquee">
            <div className="cpx-marquee-track" style={{ animationDuration: marqueeDuration }}>
              {marqueeReviews.map((t, i) => {
                const role = t.tags || t.age || "";
                const initial = (t.client_name || "?").trim().charAt(0).toUpperCase();
                return (
                  <div className="cpx-review" key={`${t.id}-${i}`} aria-hidden={i >= testimonials.length}>
                    <div className="cpx-review-stars">★★★★★</div>
                    <p className="cpx-review-body">{`“${t.body}”`}</p>
                    <div className="cpx-review-foot">
                      <div className="cpx-review-avatar">
                        {t.image_url ? <img src={t.image_url} alt={t.client_name} /> : initial}
                      </div>
                      <div>
                        <div className="cpx-review-name">{t.client_name}</div>
                        {role && <div className="cpx-review-role">{role}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="profile-onboarding cpx-pad" id="coach-next" tabIndex={-1} data-reveal><p className="eyebrow">A little structure from day one</p><h2>WHAT HAPPENS <em>NEXT.</em></h2><div className="steps-grid">{[['1','Make it official','Choose an available package and complete your enrolment.'],['2','Tell us about you','Complete your intake so your coach understands your goals and routine.'],['3','Build your rhythm','Your coach reviews your details, then helps you get started with a personal plan.']].map(([number,title,copy]) => <div key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></section>
      <section id="coach-faq" tabIndex={-1} className="profile-faq cpx-pad" data-reveal><div><p className="eyebrow">Before you begin</p><h2>GOOD TO <em>KNOW.</em></h2></div><div className="faq-list">{[['What’s different about couple coaching?', 'Two people enrol with one coach and a shared start date. Each person receives individual guidance. The displayed couple price covers both participants.'],['Is the weekly price a subscription?', 'No. The weekly price helps compare programs. You pay the full program total once, with no automatic renewal.'],['Can I speak to my coach first?', 'Choose the 20-minute consultation when it is available for your coach and pricing region. You can schedule the call after payment.'],['What if my coach’s plan is full?', 'Available programs can be booked. When a plan is full, you can join its waitlist. Couple programs require two available places.']].map(([question,answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

      {/* STICKY BOTTOM CTA */}
      {!isCoupleMode && <div className="cpx-sticky">
        <div className="cpx-sticky-inner">
          <div className="cpx-sticky-info">
            <div className="cpx-sticky-name">{coach.name}</div>
            {!isCoupleMode && hasSelectedPrice ? (
              <div className="cpx-sticky-sub">
                <span className="cpx-sticky-plan">{prettyPlan(activePlan)}</span>
                <span className="cpx-sticky-price">{price}</span>
              </div>
            ) : null}
          </div>
          <button type="button" className="cpx-sticky-btn" disabled={!hasSelectedPrice || coach.preview} onClick={goEnroll}>
            {coach.preview ? 'Local preview' : selectedActionLabel}
          </button>
        </div>
      </div>}

      {showAllPlans && (
        <div
          className="cpx-all-plans-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowAllPlans(false);
          }}
        >
          <section
            className="cpx-all-plans-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cpx-all-plans-title"
          >
            <header className="cpx-all-plans-head">
              <div>
                <p className="cpx-all-plans-eyebrow">Choose your plan</p>
                <h2 id="cpx-all-plans-title">All plans with {firstName}</h2>
                <p>Select a timeline below. Your price and next step will update automatically.</p>
              </div>
              <button
                ref={allPlansCloseRef}
                type="button"
                className="cpx-all-plans-close"
                onClick={() => setShowAllPlans(false)}
                aria-label="Close all plans"
              >
                &times;
              </button>
            </header>

            <div className="cpx-all-plans-grid">
              {coachingPlanNames.map((plan) => renderCoachingPill(plan))}
              {renderConsultationPill()}
            </div>

            <p className="cpx-all-plans-note">
              Prices shown are for your selected {countryCode === "DOMESTIC" ? "Domestic" : "International"} region.
            </p>
          </section>
        </div>
      )}

      {/* Waiting List Modal */}
      {showWaitingList && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowWaitingList(false); }}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "32px",
            maxWidth: "480px", width: "100%", position: "relative",
            fontFamily: "Open Sans",
          }}>
            <button onClick={() => setShowWaitingList(false)} style={{
              position: "absolute", top: "12px", right: "16px",
              background: "none", border: "none", fontSize: "24px",
              cursor: "pointer", color: "#999",
            }}>×</button>
            <h3 style={{ fontFamily: "Montserrat", fontSize: "20px", fontWeight: "700", marginBottom: "6px", color: "#1a1a1a" }}>
              Join Waiting List
            </h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
              for <strong>{coach.name}</strong>
            </p>
            <form data-clarity-mask="true" data-form-id="waiting_list" onSubmit={async (e) => {
              e.preventDefault();
              if (coach.preview || waitingListLoading) return;
              setWaitingListLoading(true);
              setWaitingListError("");
              try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/admin_functions/coach/${coach.id}/waiting-list/`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...waitingListData, plan: activePlan || "" }),
                });
                if (!res.ok) throw new Error("Failed to submit");
                setWaitingListSuccess(true);
                trackCoachEvent("join_waitlist", coach, { ...analyticsPlanFields(activePlan), form_id: "waiting_list" });
              } catch {
                setWaitingListError("Something went wrong. Please try again.");
              } finally {
                setWaitingListLoading(false);
              }
            }}>
              {waitingListSuccess ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ fontSize: "48px", marginBottom: "12px", lineHeight: 1 }}>✅</p>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#1b8a4a" }}>
                    You've been added to the waiting list!
                  </p>
                  <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
                    We'll reach out when {coach.name} has an opening.
                  </p>
                  <button type="button" onClick={() => setShowWaitingList(false)} style={{
                    marginTop: "20px", padding: "10px 24px", borderRadius: "8px",
                    background: "#7c3aed", color: "#fff", border: "none",
                    fontFamily: "Open Sans", fontSize: "14px", fontWeight: "600", cursor: "pointer",
                  }}>Close</button>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "4px" }}>Full Name <sup style={{ color: "red" }}>*</sup></label>
                    <input type="text" required value={waitingListData.name}
                      onChange={(e) => setWaitingListData((prev) => ({ ...prev, name: e.target.value }))}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", fontFamily: "Open Sans", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "4px" }}>Email <sup style={{ color: "red" }}>*</sup></label>
                    <input type="email" required value={waitingListData.email}
                      onChange={(e) => setWaitingListData((prev) => ({ ...prev, email: e.target.value }))}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", fontFamily: "Open Sans", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "4px" }}>WhatsApp Number</label>
                    <input type="tel" value={waitingListData.phone_number}
                      onChange={(e) => setWaitingListData((prev) => ({ ...prev, phone_number: e.target.value }))}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", fontFamily: "Open Sans", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "4px" }}>Additional Details</label>
                    <textarea value={waitingListData.details}
                      onChange={(e) => setWaitingListData((prev) => ({ ...prev, details: e.target.value }))}
                      rows={3}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", fontFamily: "Open Sans", resize: "vertical", boxSizing: "border-box" }}
                    />
                  </div>
                  {waitingListError && <p style={{ color: "#d32f2f", fontSize: "13px", marginBottom: "12px" }}>{waitingListError}</p>}
                  <button type="submit" disabled={waitingListLoading} style={{
                    width: "100%", padding: "12px", borderRadius: "8px",
                    background: waitingListLoading ? "#b39ddb" : "#7c3aed",
                    color: "#fff", border: "none", fontFamily: "Open Sans",
                    fontSize: "15px", fontWeight: "600", cursor: waitingListLoading ? "not-allowed" : "pointer",
                  }}>
                    {waitingListLoading ? "Submitting..." : "Join Waiting List"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {showForm && (
        <ClientPaymentForm
          coachId={coach.id}
          coachName={coach.name}
          planId={planIdMap[activePlan]}
          analyticsPlanId={analyticsPlanFields(activePlan).plan_id}
          planName={activePlan}
          paymentMode={countryCode === "DOMESTIC" ? "cashfree" : "razorpay"}
          calendlyLink={coach.calendly_link}
          spurfit_url={coach.spurfit_url}
          subscriptionAmount={price}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default React.memo(CoachCard);
