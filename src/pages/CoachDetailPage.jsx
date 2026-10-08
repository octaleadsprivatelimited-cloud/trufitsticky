import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CoachCard from "../components/coaches/CoachCard";
import { previewCoaches, coachSlug, fetchCatalog } from "../components/coaches/catalog";
import { analytics } from '../analytics/analytics';
import Loading from "../components/Loading";
import "../components/coaches/coachPage.css";

const CoachDetailPage = () => {
  const { coachName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [coach, setCoach] = useState(location.state?.coach || null);
  const [loading, setLoading] = useState(!location.state?.coach);
  const [error, setError] = useState(null);
  const normalizedRoute = String(coachName || "").toLowerCase().replace(/\s+/g, "");
  const isCurrentCoach = Boolean(coach && (coachSlug(coach).toLowerCase() === normalizedRoute || coach.name.toLowerCase().replace(/\s+/g, "") === normalizedRoute));

  useEffect(() => {
    const controller = new AbortController();
    setError(null);
    // If coach was passed via router state, skip the API call entirely
    if (location.state?.coach) {
      setCoach(location.state.coach);
      setLoading(false);
      return () => controller.abort();
    }

    const fetchCoach = async () => {
      try {
        setLoading(true);
        const data = await fetchCatalog("coach-profiles", controller.signal);

        // Resolve by the custom profile handle first; fall back to the legacy
        // name-slug so links shared before custom handles existed still work.
        // react-router already URL-decodes params; guard a stray % so we don't throw.
        let decodedName = coachName;
        try { decodedName = decodeURIComponent(coachName); } catch { decodedName = coachName; }
        const handle = decodedName.toLowerCase();
        const nameSlug = decodedName.toLowerCase().replace(/\s+/g, "");

        const coachList = Array.isArray(data) ? data : (data.results || []);
        const foundCoach =
          coachList.find((c) => c.profile_slug && c.profile_slug.toLowerCase() === handle) ||
          coachList.find((c) => {
            const coachNameSlug = c.name.toLowerCase().replace(/\s+/g, "");
            return coachNameSlug === nameSlug || c.name.toLowerCase() === decodedName.toLowerCase();
          });

        if (foundCoach) {
          setCoach(foundCoach);
        } else {
          setError("Coach not found");
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        if (import.meta.env.DEV) {
          console.error("Error fetching coach:", err);
        }
        const preview = previewCoaches.find(c => coachSlug(c) === coachName);
        if (preview) setCoach(preview);
        else setError("Failed to load coach information");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    if (coachName) {
      fetchCoach();
    }
    return () => controller.abort();
  }, [coachName, location.state]);

  useEffect(() => {
    if (!isCurrentCoach || loading || error) return;
    const frame = requestAnimationFrame(() => {
      const title = `${coach.name} — Coach Profile & Plans | Tru Fit`;
      const description = `Explore ${coach.name}’s coaching approach, experience, plans, and consultation options at Tru Fit.`;
      document.title = title;
      for (const [selector, value] of [['meta[name="description"]',description],['meta[property="og:title"]',title],['meta[property="og:description"]',description],['meta[name="twitter:title"]',title],['meta[name="twitter:description"]',description]]) document.querySelector(selector)?.setAttribute('content',value);
      analytics.coach(coach, location.pathname, title);
    });
    return () => cancelAnimationFrame(frame);
  }, [coach, isCurrentCoach, loading, error, location.pathname]);

  const handleClose = () => {
    navigate("/coaches");
  };

  if (loading || (!isCurrentCoach && !error)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <Loading />
      </div>
    );
  }

  if (error || !coach) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "80vh",
        padding: "20px"
      }}>
        <p style={{ 
          color: "#9c27ff", 
          fontFamily: "Open Sans", 
          fontSize: "20px",
          marginBottom: "20px"
        }}>
          {error || "Coach not found"}
        </p>
        <button
          onClick={handleClose}
          style={{
            padding: "10px 20px",
            backgroundColor: "#9c27ff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontFamily: "Open Sans",
            fontSize: "16px"
          }}
        >
          Back to Coaches
        </button>
      </div>
    );
  }

  return <CoachCard key={coach.id} coach={coach} initialPlan={location.state?.landingPlan || null} initialCoupleMode={Boolean(location.state?.coupleMode)} onClose={handleClose} isPage={true} />;
};

export default CoachDetailPage;

