export const CONSENT_KEY = 'trufit_analytics_consent_v1';
const CONSENT_AGE = 180 * 24 * 60 * 60 * 1000;
const events = new Set(['page_view','cta_click','quiz_start','quiz_complete','select_coach','view_coach','filter_coaches','filter_plans','plan_interest','select_plan','begin_checkout','generate_lead','form_start','form_error','join_waitlist','contact_click','scroll_depth']);
const fields = new Set(['page_title','page_location','page_referrer','page_path','content_group','source','filter','form_id','error_type','coach_id','coach_name','coach_slug','coach_level','pricing_region','plan_id','plan_type','duration_weeks','value','currency','percent_scrolled']);
export const isPrivatePath = path => /^\/(payment|survey)(\/|$)/.test(path);
export function cleanUrl(value, base = 'https://www.betrufit.com') {
 try { const u = new URL(value,base); return `${u.origin}${u.pathname}`; } catch { return ''; }
}
export function safeParams(params = {}) {
 const safe={};
 for(const [key,value] of Object.entries(params)) {
  if(!fields.has(key)||value==null)continue;
  if(typeof value==='number' && Number.isFinite(value))safe[key]=value;
  else if(['page_location','page_referrer'].includes(key))safe[key]=cleanUrl(String(value));
  else if(typeof value==='string' && !/[\n\r@?]/.test(value) && value.length <= 160) safe[key]=value;
 }
 return safe;
}
export function createAnalytics({ ga4Id='', clarityId='', enabled=true, debug=false }, w, d) {
 let started=false, active=false, previousPage='', lastPage='', routePath=w.location.pathname;
 let coachContext={}, coachPath='', lastCoachView='';
 const validGa=/^G-[A-Z0-9]+$/.test(ga4Id), validClarity=/^[a-z0-9]{4,32}$/i.test(clarityId);
 const readConsent=()=>{try{const v=JSON.parse(w.localStorage.getItem(CONSENT_KEY));return v?.version===1 && typeof v.analytics==='boolean' && Date.now()-v.updatedAt<CONSENT_AGE && v.updatedAt<=Date.now()?v:null}catch{return null}};
 const loadScript=(id,src)=>{if(d.getElementById(id))return;const s=d.createElement('script');s.id=id;s.async=true;s.src=src;d.head.appendChild(s)};
 const clearCookies=()=>{
  const host=w.location.hostname;
  const domains=['',host,...host.split('.').map((_,i)=>'.'+host.split('.').slice(i).join('.'))];
  for(const cookie of d.cookie.split(';')){const name=cookie.trim().split('=')[0];if(!/^(_ga|_gid|_gat|_clck|_clsk)/.test(name))continue;for(const domain of domains)d.cookie=`${name}=; Max-Age=0; Path=/;${domain?` Domain=${domain};`:''}`;}
 };
 const init=()=>{
  active=readConsent()?.analytics===true;
  if(!active||!enabled||isPrivatePath(routePath)||started)return;
  if(!validGa&&!validClarity)return;
  started=true;
  if(validGa){
   w.dataLayer=w.dataLayer||[];w.gtag=w.gtag||function(){w.dataLayer.push(arguments)};
   w.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   w.gtag('consent','update',{analytics_storage:'granted'});
   w.gtag('js',new Date());
   w.gtag('config',ga4Id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,ignore_referrer:false,debug_mode:debug,page_location:cleanUrl(routePath,w.location.origin),page_referrer:cleanUrl(d.referrer)});
   loadScript('trufit-ga4',`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`);
  }
  if(validClarity){
   w.clarity=w.clarity||function(){(w.clarity.q=w.clarity.q||[]).push(arguments)};
   w.clarity('consentv2',{analytics_Storage:'granted',ad_Storage:'denied'});
   loadScript('trufit-clarity',`https://www.clarity.ms/tag/${clarityId}`);
  }
 };
 const track=(name,params={})=>{
  if(!events.has(name)||!readConsent()?.analytics||isPrivatePath(routePath))return false;
  const safe=safeParams({...coachContext,...params,page_location:cleanUrl(routePath,w.location.origin)});
  if(debug){w.__trufitAnalyticsDebug=w.__trufitAnalyticsDebug||[];w.__trufitAnalyticsDebug.push({name,params:safe});if(w.__trufitAnalyticsDebug.length>250)w.__trufitAnalyticsDebug.shift();w.console?.debug('[Tru Fit analytics]',JSON.stringify({name,params:safe}));}
  if(!enabled)return false;
  init();
  if(validGa)w.gtag?.('event',name,safe);
  if(validClarity && name!=='page_view') {
   for(const key of ['coach_id','coach_name','coach_slug','coach_level','pricing_region','plan_type','duration_weeks']) if(safe[key]!=null) w.clarity?.('set',key,String(safe[key]));
   w.clarity?.('event',name);
   if(safe.coach_id && /^\d{1,12}$/.test(safe.coach_id) && ['select_coach','view_coach','select_plan','begin_checkout','generate_lead','join_waitlist'].includes(name)) w.clarity?.('event',`${name}_coach_${safe.coach_id}`);
  }
  return validGa||validClarity;
 };
 const recordCoachView=()=>{
  if(coachContext.coach_id && coachPath===routePath && readConsent()?.analytics && lastCoachView!==coachPath){
   track('view_coach',{page_title:d.title});lastCoachView=coachPath;
  }
 };
 const page=(path,title)=>{
  if(coachPath!==path){coachContext={};coachPath='';lastCoachView=''}
  routePath=path;
  if(isPrivatePath(path)){
   // Drop loaded recording SDKs before displaying payment or health-questionnaire pages.
   if(started)w.location.reload();
   return;
  }
  init();
  if(!readConsent()?.analytics)return;
  if(path===lastPage){recordCoachView();return;}
  if(started && validGa) w.gtag('set',{page_location:cleanUrl(path,w.location.origin),page_referrer:previousPage||cleanUrl(d.referrer)});
  const url=cleanUrl(path,w.location.origin);
  const group=path.startsWith('/lp/')?'coach_landing':path.startsWith('/coaches/')?'coach_profile':path==='/coaches'?'coaches':path==='/plans'?'plans':path==='/'?'home':'other';
  track('page_view',{page_location:url,page_title:title,page_path:path,page_referrer:previousPage||cleanUrl(d.referrer),content_group:group});
  if(started&&validClarity)w.clarity?.('set','page_type',group);
  previousPage=url;lastPage=path;recordCoachView();
 };
 const coach=(profile,path,title=d.title)=>{
  if(!/^\/(coaches|lp)\/[^/]+\/?$/.test(path))return;
  coachContext=safeParams({coach_id:String(profile.id),coach_name:profile.name,coach_slug:profile.profile_slug||String(profile.name).toLowerCase().replace(/\s+/g,''),coach_level:profile.coach_level});
  coachPath=path;page(path,title);
 };
 const setConsent=analytics=>{
  const wasActive=started;
  try { w.localStorage.setItem(CONSENT_KEY,JSON.stringify({version:1,analytics:Boolean(analytics),updatedAt:Date.now()})); } catch { return false; }
  active=Boolean(analytics);
  if(!active){
   w.gtag?.('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   w.clarity?.('consentv2',{analytics_Storage:'denied',ad_Storage:'denied'});
   clearCookies();
  }
  w.dispatchEvent(new w.Event('trufit-consent-change'));
  if(active){lastPage='';init();page(routePath,d.title)}
  else if(wasActive)w.location.reload();
  return true;
 };
 return {track,page,coach,setConsent,readConsent,hasStarted:()=>started};
}
