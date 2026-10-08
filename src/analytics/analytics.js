import { createAnalytics } from './core.mjs';
export const analytics = createAnalytics({
 ga4Id: import.meta.env.VITE_GA4_MEASUREMENT_ID || '',
 clarityId: import.meta.env.VITE_CLARITY_PROJECT_ID || '',
 enabled: ((!import.meta.env.DEV && !['localhost','127.0.0.1','::1','[::1]'].includes(window.location.hostname)) || import.meta.env.VITE_ANALYTICS_ALLOW_LOCALHOST === 'true'),
 debug: import.meta.env.DEV && import.meta.env.VITE_ANALYTICS_DEBUG === 'true',
}, window, document);
export const trackEvent = (name,params) => analytics.track(name,params);
export const openPrivacyPreferences = () => window.dispatchEvent(new Event('trufit-open-privacy'));

export const trackCoachEvent = (name,coach,params={}) => trackEvent(name,{coach_id:String(coach.id),coach_name:coach.name,coach_slug:coach.profile_slug||String(coach.name).toLowerCase().replace(/\s+/g,''),coach_level:coach.coach_level,...params});
