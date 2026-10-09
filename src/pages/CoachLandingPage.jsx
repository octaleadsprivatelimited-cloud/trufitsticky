import WhatsAppMark from '../components/coaches/WhatsAppMark';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import SharedContext from '../context/SharedContext';
import { fetchCatalog, coachSlug } from '../components/coaches/catalog';
import { coachLandings } from '../content/coachLandings.mjs';
import { FooterBottom } from '../components/Footer';
import { analytics, trackCoachEvent } from '../analytics/analytics';
import LandingEnquiry from '../components/coaches/LandingEnquiry';
import Logo from '../assets/logo-original.svg';
import Wordmark from '../assets/footer-logo-text.svg';
import '../styles/coach-landing.css';

const inclusions = [
 ['🏋️', 'Training that fits', 'Workouts shaped around your experience, schedule, and equipment.'],
 ['🥗', 'Food you can enjoy', 'Personal nutrition guidance built around your preferences.'],
 ['📈', 'Regular check-ins', 'Review your progress and adjust the plan as you go.'],
 ['💬', 'A coach in your corner', 'Ongoing guidance to help you build consistent habits.'],
];

export default function CoachLandingPage() {
 const { coachName } = useParams();
 const content = coachLandings[coachName];
 const { pathname } = useLocation();
 const { countryCode, setCountryCode } = useContext(SharedContext);
 const region = countryCode || 'DOMESTIC';
 const [coach, setCoach] = useState(null);
 const [plans, setPlans] = useState([]);
 const [reviews, setReviews] = useState([]);
 const [selectedId, setSelectedId] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [retry, setRetry] = useState(0);
 useEffect(() => {
  const controller = new AbortController();
  setLoading(true); setError(''); setCoach(null); setSelectedId(null);
  Promise.allSettled([
   fetchCatalog('coach-profiles', controller.signal),
   fetchCatalog('plans', controller.signal),
   fetchCatalog('testimonials', controller.signal),
  ]).then(([profiles, prices, feedback]) => {
   if (controller.signal.aborted) return;
   const found = profiles.status === 'fulfilled' && profiles.value.find(item => coachSlug(item) === coachName && item.status !== 'hard');
   if (!found) setError('This coaching page is temporarily unavailable.');
   else setCoach(found);
   setPlans(prices.status === 'fulfilled' ? prices.value : []);
   setReviews(feedback.status === 'fulfilled' ? feedback.value : []);
   setLoading(false);
  });
  return () => controller.abort();
 }, [coachName, retry]);
 useEffect(() => {
  if (!coach || !content) return;
  const frame = requestAnimationFrame(() => analytics.coach(coach, pathname, `Train with ${coach.name} | Tru Fit`));
  return () => cancelAnimationFrame(frame);
 }, [coach, content, pathname]);
 const pricedPlans = useMemo(() => plans.filter(plan =>
  plan.category?.coach_level?.toLowerCase() === coach?.coach_level?.toLowerCase() &&
  plan.category?.location?.toUpperCase() === region && Number(plan.price) > 0
 ).sort((a, b) => Number(a.duration_weeks) - Number(b.duration_weeks)), [plans, coach, region]);
 const programs = pricedPlans.filter(plan => Number(plan.duration_weeks) > 0);
 const active = programs.find(plan => String(plan.id) === selectedId) || programs.find(plan => plan.recommended) || programs[0];
 const consultation = pricedPlans.find(plan => !Number(plan.duration_weeks));
 const currency = region === 'DOMESTIC' ? 'INR' : 'USD';
 const money = amount => new Intl.NumberFormat(region === 'DOMESTIC' ? 'en-IN' : 'en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(amount));
 const minimum = programs.length ? Math.min(...programs.map(plan => Number(plan.price) / Number(plan.duration_weeks))) : null;
 if (!content) return <div className="landing-unavailable wrap"><h1>Page not found.</h1><Link className="button" to="/coaches">Explore coaches ↗</Link></div>;
 if (loading) return <div className="landing-unavailable wrap" role="status">Loading your coaching options…</div>;
 if (!coach || error) return <div className="landing-unavailable wrap" role="alert"><h1>Let’s try that again.</h1><p>{error}</p><button className="button" onClick={() => setRetry(value => value + 1)}>Retry</button><Link className="text-link" to="/coaches">Browse coaches →</Link></div>;
 const firstName = coach.name.split(' ')[0];
 const slug = coachSlug(coach);
 const profileUrl = `/coaches/${slug}#cpx-plans`;
 const whatsappNumber = String(coach.whatsapp_number || '917207259556').replace(/\D/g, '');
 const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi ${firstName}, I would like to know more about your Tru Fit coaching plans.`)}`;
 const planFields = plan => ({ source: 'coach_landing', plan_id: String(plan.id), plan_type: plan.duration_weeks ? 'individual' : 'consultation', duration_weeks: Number(plan.duration_weeks) || 0, pricing_region: region, currency, value: Number(plan.price) });
 const contact = source => trackCoachEvent('contact_click', coach, { source, pricing_region: region });
 const bookingState = plan => ({ coach, landingPlan: plan?.duration_weeks ? `${plan.duration_weeks} weeks` : 'Consultation Call' });
 const capacity = active && coach.dynamic_capacities?.[String(active.duration_weeks)]?.[region.toLowerCase()];
 const full = capacity?.max != null && Number(capacity.current) >= Number(capacity.max);
 const consultationEnabled = coach[`${region.toLowerCase()}_consultation_enabled`] !== false && consultation;
 const consultationPrice = coach[`${region.toLowerCase()}_consultation_price`] ?? consultation?.price;
 const memberReviews = reviews.filter(review => review.body && review.client_name &&
  (review.coach_id != null ? String(review.coach_id) === String(coach.id) : review.coach != null ? String(review.coach?.id ?? review.coach) === String(coach.id) : true));
 const ratedReviews = memberReviews.filter(review => Number(review.rating) >= 1 && Number(review.rating) <= 5);
 const average = ratedReviews.length ? (ratedReviews.reduce((sum, review) => sum + Number(review.rating), 0) / ratedReviews.length).toFixed(1) : null;
 const faq = [
  ['Who is this coaching for?', `${firstName} works with people who want a practical approach to training, nutrition, and sustainable habits. Talk through your experience and goals before choosing your program.`],
  ['What does the price include?', 'Personalized training, nutrition guidance, regular progress reviews, and ongoing coach support. Your full program inclusions are available in the booking flow.'],
  ['Is this a weekly subscription?', 'No. The weekly figure is a comparison. You pay the full program price once, with no automatic renewal.'],
  ['Can I speak to my coach before joining?', 'Where available, choose the paid 20-minute consultation to discuss your goals and coaching options. Schedule the call after completing payment.'],
  ['Do you offer coaching for couples?', 'Couple programs can be explored on the full coach profile. Package availability and prices depend on the current catalogue.'],
  ['What happens after I book?', 'Complete your booking, then follow the onboarding instructions to share your goals and get started. For a consultation, schedule your call after payment.'],
  ['Are results guaranteed?', 'Each person’s experience is different. Your starting point, consistency, health, and circumstances affect your progress. The transformation shared here is your coach’s own story.'],
 ];
 return <div className="sales-landing">
  <header className="landing-header"><div className="landing-wrap"><Link className="landing-logo" to="/" aria-label="Tru Fit home"><img src={Logo} alt=""/><img src={Wordmark} alt=""/></Link><nav aria-label="Coaching page"><a href="#landing-inclusions">Coaching</a><a href="#landing-stories">His story</a><a href="#landing-plans">Plans</a><Link to={`/coaches/${slug}`} state={{coach}}>Full profile ↗</Link></nav><a className="button" href="#landing-plans">View plans</a></div></header>
  <section className="landing-hero landing-wrap">
   <div className="landing-hero-copy"><span className="landing-coach-pill">{coach.coach_level_name || 'Personal'} coach · {coach.name}</span><h1>Online coaching with<br/><em>{firstName}.</em></h1><p className="landing-intro">{content.audience}</p><p className="landing-coach-note">A personal training and nutrition plan. Regular check-ins. Real support from {firstName}.</p>
    <div className="landing-actions"><a className="button" href="#landing-plans" onClick={() => trackCoachEvent('cta_click', coach, { source: 'landing_hero_plans' })}>View coaching plans</a><a className="landing-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => contact('landing_hero')}><WhatsAppMark/>Chat on WhatsApp</a></div>
    <p className="landing-price-teaser">{minimum ? <>Plans from <strong>{money(Math.ceil(minimum))}/week</strong> · paid upfront</> : 'Explore your coaching options below.'}</p>
    {average && <a className="landing-rating" href="#landing-stories"><span aria-hidden="true">★★★★★</span> {average}/5 · {ratedReviews.length} published {ratedReviews.length === 1 ? 'review' : 'reviews'}</a>}
   </div>
   <div className="landing-simple-portrait"><img src={coach.image} alt={coach.name} fetchPriority="high"/></div>
  </section>
  <div className="landing-assurance landing-wrap"><span>✓ Personalized training</span><span>✓ Nutrition guidance</span><span>✓ Regular check-ins</span></div>
  <section className="landing-plans landing-wrap" id="landing-plans" tabIndex={-1}><div className="landing-section-heading"><div><p className="eyebrow">Choose your commitment</p><h2>Choose your coaching plan.</h2></div><label className="landing-region">Pricing region<select value={region} onChange={event => { setCountryCode(event.target.value); setSelectedId(null); trackCoachEvent('filter_plans', coach, { source: 'coach_landing', pricing_region: event.target.value }); }}><option value="DOMESTIC">India · INR</option><option value="INTERNATIONAL">International · USD</option></select></label></div>
   {programs.length ? <><div className="landing-plan-grid" role="radiogroup" aria-label="Choose your coaching duration">{programs.map(plan => <label key={plan.id} className={`landing-plan ${active?.id === plan.id ? 'is-selected' : ''}`}><input type="radio" name="landing-plan" checked={active?.id === plan.id} onChange={() => { setSelectedId(String(plan.id)); trackCoachEvent('select_plan', coach, planFields(plan)); }}/><span className="landing-plan-badge">{plan.recommended ? 'Recommended' : 'Individual coaching'}</span><h3>{plan.duration_weeks}<span> weeks</span></h3><strong>{money(plan.price)}</strong><p>Full program total</p><span className="landing-weekly">About {money(Math.ceil(Number(plan.price) / Number(plan.duration_weeks)))}/week</span></label>)}</div><div className="landing-booking-row"><div><strong>{active.duration_weeks}-week coaching with {firstName}</strong><p>{money(active.price)} total · one payment · no automatic renewal</p></div><Link className="button" to={profileUrl} state={bookingState(active)} onClick={() => trackCoachEvent('cta_click', coach, { ...planFields(active), source: 'landing_booking' })}>{full ? 'View waitlist options ↗' : 'Continue to booking ↗'}</Link></div>{coach.preview && <p className="landing-preview-note">Local preview: checkout remains disabled.</p>}</> : <p className="landing-price-unavailable">Pricing is temporarily unavailable. <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => contact('landing_prices_unavailable')}>Ask {firstName} about plans ↗</a></p>}
   {consultationEnabled && <div className="landing-consultation"><div><strong>Want to talk it through first?</strong><p>A 20-minute consultation · {money(consultationPrice)}</p></div><Link className="text-link" to={profileUrl} state={bookingState(consultation)} onClick={() => trackCoachEvent('cta_click', coach, { ...planFields(consultation), source: 'landing_consultation' })}>Book a consultation ↗</Link></div>}
  </section>
  <section className="landing-story landing-wrap" id="landing-stories" tabIndex={-1}>
   <div className="landing-story-stat"><span className="eyebrow">His own success story</span><strong>{content.journey}</strong><p>{content.journeyLabel}</p><span className="landing-small">Personal experience shared in {firstName}’s profile.</span></div>
   <div><p className="eyebrow">Lived experience. Practical guidance.</p><h2>{content.storyTitle}</h2><blockquote>{coach.summary || coach.previous_work}</blockquote><p className="landing-story-credit">— {coach.name}, Tru Fit coach</p></div>
  </section>
  {memberReviews.length ? <section className="landing-member-stories landing-wrap"><div className="landing-section-heading"><div><p className="eyebrow">Tru Fit member experiences</p><h2>In their own words.</h2></div>{average && <p className="landing-rating">★ {average}/5 · {ratedReviews.length} reviews</p>}</div><div className="landing-review-grid">{memberReviews.slice(0, 3).map((review, index) => <article key={review.id || index}>{review.image_url && <img src={review.image_url} alt={review.client_name} loading="lazy"/>}{Number(review.rating) >= 1 && Number(review.rating) <= 5 && <p aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(Math.round(Number(review.rating)))}</p>}<blockquote>{review.body}</blockquote><strong>{review.client_name}</strong></article>)}</div></section> : null}
  <section className="landing-inclusions landing-wrap" id="landing-inclusions"><div className="landing-section-heading"><div><p className="eyebrow">A plan. A person. A little structure.</p><h2>What’s included</h2></div></div><div className="landing-benefit-grid">{inclusions.map(([icon, title, text]) => <article key={title}><span aria-hidden="true">{icon}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>


  <section className="landing-steps landing-wrap"><div><span>01</span><strong>Pick your plan</strong><p>Choose the duration that works for you.</p></div><div><span>02</span><strong>Meet your coach</strong><p>Share your goals and your starting point.</p></div><div><span>03</span><strong>Build your rhythm</strong><p>Train, check in, and adjust as you go.</p></div></section>
  <LandingEnquiry key={coach.id} coach={coach} whatsappUrl={whatsappUrl}/>
  <section className="landing-faq landing-wrap" id="landing-faq" tabIndex={-1}><div><p className="eyebrow">Before you begin</p><h2>Frequently asked questions</h2><a href={whatsappUrl} className="landing-whatsapp" target="_blank" rel="noreferrer" onClick={() => contact('landing_faq')}><WhatsAppMark/>Chat on WhatsApp</a></div><div className="faq-list">{faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

  <footer className="landing-footer landing-wrap"><nav className="landing-explore" aria-label="Explore coaching"><Link to="/">Home</Link><Link to="/start">Meet both coaches</Link><Link to="/coaches">All coaches</Link><Link to={`/coaches/${slug}`} state={{coach}}>Full profile</Link><Link to="/plans">All plans</Link><Link to="/findmycoach">Find my match</Link></nav><FooterBottom/></footer>
  <aside className="landing-sticky" aria-label="Quick coaching actions"><div className="landing-wrap"><div><strong>Coaching with {firstName}</strong><span>{minimum ? <>From {money(Math.ceil(minimum))}/week · paid upfront</> : 'Personal guidance. A plan that fits.'}</span></div><a href={whatsappUrl} className="landing-sticky-chat" target="_blank" rel="noreferrer" onClick={() => contact('landing_sticky')}><WhatsAppMark/>WhatsApp</a><a className="button" href="#landing-plans" onClick={() => trackCoachEvent('cta_click', coach, { source: 'landing_sticky_plans' })}>Choose a plan</a></div></aside>
 </div>;
}
