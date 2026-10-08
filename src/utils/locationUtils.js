/**
 * Location (region) detection for currency/pricing + payment-gateway routing.
 *
 * SILENT, consent-free: we only need DOMESTIC (India) vs INTERNATIONAL, which is
 * derived from the visitor's IP via free IP-geolocation services. No browser
 * Geolocation permission prompt is ever shown. (Precise GPS is intentionally NOT
 * used — it requires a permission popup and we don't need street-level accuracy.)
 */

// Free, no-key, CORS-friendly IP-geolocation endpoints, tried in order. Each
// returns the visitor's country; we collapse it to DOMESTIC / INTERNATIONAL.
const IP_SERVICES = [
  { url: "https://ipapi.co/json/", pick: (d) => d && d.country_code },
  { url: "https://ipwho.is/", pick: (d) => d && d.country_code },
  { url: "https://api.country.is/", pick: (d) => d && d.country },
];

/**
 * Silently resolve the visitor's region from their IP. Tries each service until
 * one answers; caches the result for the session. Returns "" only if every
 * service is unreachable (the caller then applies a default — still no popup).
 *
 * @returns {Promise<"DOMESTIC"|"INTERNATIONAL"|"">}
 */
export const getLocationByIP = async () => {
  const cached = sessionStorage.getItem("tf_location");
  if (cached === "DOMESTIC" || cached === "INTERNATIONAL") {
    return cached;
  }

  for (const svc of IP_SERVICES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(svc.url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) continue;

      const data = await res.json();
      const country = svc.pick(data);
      if (!country) continue;

      const result = String(country).toUpperCase() === "IN" ? "DOMESTIC" : "INTERNATIONAL";
      sessionStorage.setItem("tf_location", result);
      if (import.meta.env.DEV) {
        console.log(`[LocationUtils] region via ${svc.url}: ${country} -> ${result}`);
      }
      return result;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn(`[LocationUtils] ${svc.url} failed:`, err && err.message);
      }
      // try the next service
    }
  }

  if (import.meta.env.DEV) {
    console.warn("[LocationUtils] all IP services failed; caller will use default region");
  }
  return "";
};

/**
 * Main entry point — silent IP-based region detection only. Never prompts.
 * @returns {Promise<"DOMESTIC"|"INTERNATIONAL"|"">}
 */
export const detectLocation = async () => {
  return getLocationByIP();
};
