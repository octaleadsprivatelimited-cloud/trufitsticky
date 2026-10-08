import { landingSeoPages } from '../content/coachLandings.mjs';
export const DEFAULT_ORIGIN='https://www.betrufit.com';
export const pages={
 ...landingSeoPages,
 '/start':{title:'Meet Your Coach — Coaching Stories & Plans | Tru Fit',heading:'Your next chapter. Your kind of coach.',description:'Meet Jaswant and Srikar, explore their personal journeys, compare coaching plans, and start your Tru Fit journey.'},
 '/':{title:'Tru Fit — Personal Fitness Coaching That Fits Your Life',heading:'Fitness that fits your life.',description:'Find a real coach, personalized workouts, nutrition guidance, and regular check-ins. Build sustainable fitness habits with Tru Fit.'},
 '/coaches':{title:'Find Your Coach — Personal Fitness Coaches | Tru Fit',heading:'Find your kind of coach.',description:'Explore Tru Fit coaches, compare experience and specialties, and find personalized fitness coaching that fits your goals and routine.'},
 '/plans':{title:'Coaching Plans & Pricing | Tru Fit',heading:'Your goals. Your kind of plan.',description:'Explore Tru Fit coaching programs, compare durations and regional prices, and choose a personal coach. See the full price before starting.'},
 '/about':{title:'Our Approach to Personal Fitness Coaching | Tru Fit',heading:'A healthier life. On your terms.',description:'Get to know Tru Fit: human coaching, practical routines, and sustainable fitness habits built around your real life.'},
 '/findmycoach':{title:'Find My Coach — Fitness Coach Matching | Tru Fit',heading:'Find the right coach for you.',description:'Take a short questionnaire about your routine and preferences to find Tru Fit coaches who match your fitness goals.'},
 '/privacy-policy':{title:'Privacy Policy | Tru Fit',heading:'Privacy Policy',description:'Learn how Tru Fit handles your information, optional Google Analytics and Microsoft Clarity tracking, cookies, and privacy choices.'},
 '/terms-conditions':{title:'Terms & Conditions | Tru Fit',heading:'Terms & Conditions',description:'Read the terms for Tru Fit coaching services, consultations, bookings, and payments.'},
 '/refund-policy':{title:'Refund Policy | Tru Fit',heading:'Refund Policy',description:'Read Tru Fit’s refund policy for coaching programs and consultations.'}
};
export function siteOrigin(value=DEFAULT_ORIGIN){
 const url=new URL(value);
 if(url.protocol!=='https:'||url.username||url.password)throw new Error('VITE_SITE_URL must be a public HTTPS origin.');
 return url.origin;
}
export const escapeHtml = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function structuredData(origin=DEFAULT_ORIGIN){return {'@context':'https://schema.org','@graph':[
 {'@type':'Organization','@id':origin+'/#organization',name:'Tru Fit',url:origin,logo:origin+'/trufit-logo.svg',email:'support@betrufit.com',sameAs:['https://www.instagram.com/betrufit','https://www.linkedin.com/company/tru-fit','https://www.youtube.com/c/betrufit']},
 {'@type':'WebSite','@id':origin+'/#website',url:origin,name:'Tru Fit',publisher:{'@id':origin+'/#organization'}}
]}}
