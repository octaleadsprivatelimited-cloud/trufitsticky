import React, { useState, useEffect } from "react";
import SharedContext from "./SharedContext";
import { detectLocation } from "../utils/locationUtils";

const SharedState = ({ children }) => {
  const [queFilteredCoaches, setQueFilteredCoaches] = useState(null);
  // Initialize from session cache so there's no flash on page refresh
  const [countryCode, setCountryCodeRaw] = useState(
    () => {
      const cached = sessionStorage.getItem("tf_location");
      return cached === "DOMESTIC" || cached === "INTERNATIONAL" ? cached : "";
    }
  );
  const [locationLoading, setLocationLoading] = useState(
    () => {
      const cached = sessionStorage.getItem("tf_location");
      return !(cached === "DOMESTIC" || cached === "INTERNATIONAL");
    }
  );
  const [ipDetectionFailed, setIpDetectionFailed] = useState(false);

  // Wrap setter to persist manual selections to session cache
  const setCountryCode = (code) => {
    if (code === "DOMESTIC" || code === "INTERNATIONAL") {
      sessionStorage.setItem("tf_location", code);
    }
    setCountryCodeRaw(code);
  };

  // Auto-detect location on mount (silent IP first, no permission popup)
  useEffect(() => {
    // Already resolved from cache — skip API call
    if (countryCode) return;

    let cancelled = false;

    const run = async () => {
      setLocationLoading(true);

      // Silent IP-based region detection — never prompts for location permission.
      const result = await detectLocation();

      if (cancelled) return;

      // If every IP service was unreachable, default to DOMESTIC (India-first
      // market) silently rather than prompting. Visitors can still switch region
      // manually in the pricing UI.
      setCountryCode(result || "DOMESTIC");
      setIpDetectionFailed(!result);
      setLocationLoading(false);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SharedContext.Provider
      value={{
        queFilteredCoaches,
        setQueFilteredCoaches,
        countryCode,
        setCountryCode,
        locationLoading,
        ipDetectionFailed,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
};

export default SharedState;
