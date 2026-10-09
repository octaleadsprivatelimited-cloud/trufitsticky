import { scrollToSection } from '../../scroll/smoothScroll';
import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SharedContext from '../../context/SharedContext';
import LeadCapture from './LeadCapture';
import { fetchCatalog, previewCoaches, coachSlug } from './catalog';
import { trackEvent, trackCoachEvent } from '../../analytics/analytics';
import './coachPage.css';
import CoachPortrait from './CoachPortrait';
import WhatsAppMark from './WhatsAppMark';
import './coachDirectory.css';
export default function Coach(){
 const { countryCode, setCountryCode, queFilteredCoaches, setQueFilteredCoaches } = useContext(SharedContext);
 const location = useLocation();
 const featuredSlug=location.hash.startsWith('#coach-')?location.hash.slice(7):'';
 const scrolledVisit=useRef(null);
 const [coaches,setCoaches] = useState([]), [plans,setPlans] = useState([]), [loading,setLoading] = useState(true), [error,setError] = useState(''), [retry,setRetry] = useState(0);
 const [reviews,setReviews] = useState([]);
 const [tier,setTier] = useState('all'), [query,setQuery] = useState(''), [goal,setGoal] = useState('all');
 const [showLead,setShowLead] = useState(Boolean(location.state?.fromQuestionnaire) && sessionStorage.getItem('leadCaptureDate') !== new Date().toISOString().split('T')[0]);
 const [leadData,setLeadData] = useState({name:'',email:''});
 useEffect(()=>{
  const controller = new AbortController(); setLoading(true); setError('');
  const request = queFilteredCoaches && !featuredSlug ? Promise.resolve(queFilteredCoaches) : fetchCatalog('coach-profiles',controller.signal);
  request.then(data=>setCoaches(Array.isArray(data)?data:[])).catch(e=>{if(e.name !== 'AbortError'){setError(e.message);setCoaches(previewCoaches)}}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});
  fetchCatalog('plans',controller.signal).then(setPlans).catch(()=>setPlans([]));
  fetchCatalog('testimonials',controller.signal).then(setReviews).catch(()=>setReviews([]));
  return ()=>controller.abort();
 },[queFilteredCoaches,retry,featuredSlug]);
 const region = countryCode || 'DOMESTIC';
 const livePreview = coaches.some(c=>c.livePreview);
 const tiers = [...new Set(coaches.map(c=>c.coach_level).filter(Boolean))];
 const filtered = useMemo(()=>coaches.filter(c=>c.status !== 'hard' && (tier==='all'||c.coach_level===tier) && `${c.name} ${c.specializations||''}`.toLowerCase().includes(query.toLowerCase()) && (goal==='all'||String(c.specializations||'').toLowerCase().includes(goal))),[coaches,tier,query,goal]);
 useEffect(()=>{
  if(loading||!featuredSlug||scrolledVisit.current===location.key)return;
  const target=document.getElementById(`coach-${featuredSlug}`);
  if(!target)return;
  const frame=requestAnimationFrame(()=>{
   scrollToSection(target);
   target.focus({preventScroll:true});
   scrolledVisit.current=location.key;
  });
  return()=>cancelAnimationFrame(frame);
 },[loading,filtered,featuredSlug,location.key]);
 const closeLead = submitted => {if(submitted) sessionStorage.setItem('leadCaptureDate',new Date().toISOString().split('T')[0]);else setQueFilteredCoaches(null);setShowLead(false)};
 const focuses = [['all','All coaching','✦'],['weight loss','Weight loss','↘'],['strength','Strength training','↗'],['nutrition','Nutrition coaching','◉'],['habit','Healthy habits','✓'],['beginner','Beginner fitness','◎']];
 const selectFocus = value => {setGoal(value);trackEvent('filter_coaches',{filter:value})};
 return <div className="coach-catalogue">
 {showLead && <LeadCapture leadData={leadData} setLeadData={setLeadData} onSubmit={()=>closeLead(true)} onClose={closeLead} coachCount={location.state?.coachCount||filtered.length}/>}
 <div className="catalogue-layout">
  <aside className="catalogue-sidebar" aria-label="Coaching specialties"><p>Find your focus</p><nav>{focuses.map(([value,label,icon])=><button key={value} aria-pressed={goal===value} onClick={()=>selectFocus(value)}><span aria-hidden="true">{icon}</span>{label}</button>)}</nav><Link className="catalogue-match" to="/findmycoach">Need help choosing?<strong>Find my coach ↗</strong></Link></aside>
  <section className="catalogue-main" aria-label="Browse coaches">
   <header className="catalogue-heading"><div><h1>Fitness & nutrition coaches</h1><p><Link to="/">Home</Link><span aria-hidden="true"> / </span>Our coaches</p></div><label className="catalogue-search"><span className="sr-only">Search coaches</span><span aria-hidden="true">⌕</span><input type="search" placeholder="Search name or specialty" value={query} onChange={e=>setQuery(e.target.value)} data-clarity-mask="true"/></label></header>
   <div className="catalogue-controls"><span className="catalogue-count" aria-live="polite">{loading?'Loading coaches…':`${filtered.length} coaches`}</span><details className="catalogue-filters"><summary>Filters <span aria-hidden="true">☰</span></summary><div><label>Coach level<select value={tier} onChange={e=>{setTier(e.target.value);trackEvent('filter_coaches',{filter:e.target.value})}}><option value="all">All levels</option>{tiers.map(t=><option key={t} value={t}>{coaches.find(c=>c.coach_level===t)?.coach_level_name||t}</option>)}</select></label><label>Pricing region<select value={region} onChange={e=>setCountryCode(e.target.value)}><option value="DOMESTIC">India · INR</option><option value="INTERNATIONAL">International · USD</option></select></label><button onClick={()=>{setTier('all');setGoal('all');setQuery('')}}>Clear filters</button></div></details></div>
   {livePreview && <p className="preview-notice">Catalogue preview. Booking is unavailable in this preview.</p>}
   {location.state?.coupleMode && <p className="package-family-note">Choose a coach to explore couple packages.</p>}
   {error && <div className="empty-state" role="alert"><h2>We couldn’t load our coaches.</h2><p>Please try again.</p><button className="button" onClick={()=>setRetry(r=>r+1)}>Retry</button></div>}
   {loading?<div className="skeleton-grid" aria-label="Loading coaches">{[1,2,3].map(n=><div className="skeleton" key={n}/>)}</div>:<div className="catalogue-grid">{filtered.map(coach=>{
    const slug=coachSlug(coach);
    const pricePlans=plans.filter(p=>p.category?.coach_level?.toLowerCase()===coach.coach_level?.toLowerCase()&&p.category?.location?.toUpperCase()===region&&Number(p.duration_weeks)>0&&Number(p.price)>0);
    const startingPrice=pricePlans.length?Math.min(...pricePlans.map(p=>Number(p.price))):null;
    const specialties=String(coach.specializations||coach.tags||'Personal fitness coaching').split(/[,;\n]/).map(v=>v.trim()).filter(Boolean).slice(0,2);
    const feedback=reviews.filter(r=>String(r.coach_id??r.coach?.id??r.coach)===String(coach.id)&&Number(r.rating)>=1&&Number(r.rating)<=5);
    const rating=feedback.length?(feedback.reduce((sum,r)=>sum+Number(r.rating),0)/feedback.length).toFixed(1):null;
    const capacities=pricePlans.map(p=>coach.dynamic_capacities?.[String(p.duration_weeks)]?.[region.toLowerCase()]).filter(c=>c?.max!=null&&c?.current!=null);
    const slots=capacities.length?Math.max(...capacities.map(c=>Math.max(0,Number(c.max)-Number(c.current)))):null;
    const whatsapp=String(coach.whatsapp_number||'917207259556').replace(/\D/g,'');
    const selected=source=>trackCoachEvent('select_coach',coach,{source,pricing_region:region});
    const profile=`/coaches/${encodeURIComponent(slug)}`;
    const state={coach,coupleMode:Boolean(location.state?.coupleMode)};
    return <article className={`catalogue-card ${slug===featuredSlug?'is-featured-coach':''}`} id={`coach-${slug}`} tabIndex={-1} key={coach.id}>
     <Link className="catalogue-portrait" to={profile} state={state} aria-label={`View ${coach.name}’s profile`} onClick={()=>selected('directory_photo')}><CoachPortrait coach={coach}/></Link>
     <div className="catalogue-card-info"><span className="catalogue-tier">{coach.coach_level_name||coach.coach_level||'Coach'}</span><h2><Link to={profile} state={state} onClick={()=>selected('directory_name')}>{coach.name}</Link></h2><p className="catalogue-specialties">{specialties.join(' · ')}</p><p className="catalogue-proof">{rating?<><span aria-label={`${rating} out of 5 stars`}>★ {rating}</span><span> · {feedback.length} reviews</span></>:coach.experience?<span>{coach.experience} {Number(coach.experience)===1?'year':'years'} experience</span>:<span>Personalized training & nutrition</span>}</p><div className="catalogue-availability">{slots!==null?(slots>0?`${slots} ${slots===1?'place':'places'} available`:'Join waitlist'):startingPrice?`Programs from ${new Intl.NumberFormat(region==='DOMESTIC'?'en-IN':'en-US',{style:'currency',currency:region==='DOMESTIC'?'INR':'USD',maximumFractionDigits:0}).format(startingPrice)} total`:'Explore coaching programs'}</div><div className="catalogue-card-actions"><a className="catalogue-chat" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi ${coach.name.split(' ')[0]}, I’d like to ask about your Tru Fit coaching plans.`)}`} target="_blank" rel="noreferrer" aria-label={`Chat with ${coach.name} on WhatsApp`} onClick={()=>trackCoachEvent('contact_click',coach,{source:'directory_whatsapp',pricing_region:region})}><WhatsAppMark/></a><Link className="button" to={`${profile}#cpx-plans`} state={state} onClick={()=>selected('directory_plans')}>See plans <span aria-hidden="true">↗</span></Link></div></div>
    </article>;
   })}</div>}
   {!loading&&!error&&filtered.length===0&&<div className="empty-state"><h2>No matching coaches.</h2><p>Try another specialty or name.</p><button className="button button-outline" onClick={()=>{setTier('all');setGoal('all');setQuery('')}}>Clear filters</button></div>}
  </section>
 </div>
 </div>;
}
