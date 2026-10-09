import { scrollToSection } from '../../scroll/smoothScroll';
import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SharedContext from '../../context/SharedContext';
import LeadCapture from './LeadCapture';
import { fetchCatalog, previewCoaches, coachSlug } from './catalog';
import { trackEvent, trackCoachEvent } from '../../analytics/analytics';
import './coachPage.css';
import { coachLandings } from '../../content/coachLandings.mjs';
import '../../styles/featured-coaching.css';
import CoachSpecialties from './CoachSpecialties';
import CoachPortrait from './CoachPortrait';
export default function Coach(){
 const { countryCode, setCountryCode, queFilteredCoaches, setQueFilteredCoaches } = useContext(SharedContext);
 const location = useLocation();
 const featuredSlug=location.hash.startsWith('#coach-')?location.hash.slice(7):'';
 const scrolledVisit=useRef(null);
 const [coaches,setCoaches] = useState([]), [plans,setPlans] = useState([]), [loading,setLoading] = useState(true), [error,setError] = useState(''), [retry,setRetry] = useState(0);
 const [tier,setTier] = useState('all'), [query,setQuery] = useState(''), [goal,setGoal] = useState('all');
 const [showLead,setShowLead] = useState(Boolean(location.state?.fromQuestionnaire) && sessionStorage.getItem('leadCaptureDate') !== new Date().toISOString().split('T')[0]);
 const [leadData,setLeadData] = useState({name:'',email:''});
 useEffect(()=>{
  const controller = new AbortController(); setLoading(true); setError('');
  const request = queFilteredCoaches && !featuredSlug ? Promise.resolve(queFilteredCoaches) : fetchCatalog('coach-profiles',controller.signal);
  request.then(data=>setCoaches(Array.isArray(data)?data:[])).catch(e=>{if(e.name !== 'AbortError'){setError(e.message);setCoaches(previewCoaches)}}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});
  fetchCatalog('plans',controller.signal).then(setPlans).catch(()=>setPlans([]));
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
 return <><section className="page-intro wrap coach-intro"><div><p className="eyebrow">Your people. Your progress.</p><h1>Choose your coach.</h1><p>Compare specialties and plans, then enrol with the coach who fits your goals.</p></div><div className="intro-aside"><span className="status-dot"/><p>Not sure where to start?</p><Link className="text-link" to="/findmycoach" data-track="cta_click" data-source="coach_directory">Let’s find your match ↗</Link></div></section>
 {showLead && <LeadCapture leadData={leadData} setLeadData={setLeadData} onSubmit={()=>closeLead(true)} onClose={closeLead} coachCount={location.state?.coachCount||filtered.length}/>}
 <section className="wrap directory-section" aria-label="Browse coaches">
 {livePreview && <p className="preview-notice">Live catalogue preview. Profiles and prices come from Betrufit’s public catalogue; booking is disabled in this local preview.</p>}
 {location.state?.coupleMode && <p className="package-family-note"><strong>Coaching for two.</strong>Choose a coach to explore their couple packages.</p>}<div className="directory-toolbar"><div className="tier-tabs" aria-label="Coach experience"><button aria-pressed={tier==='all'} onClick={()=>{setTier('all');trackEvent('filter_coaches',{filter:'all'})}}>All coaches</button>{tiers.map(t=><button key={t} aria-pressed={tier===t} onClick={()=>{setTier(t);trackEvent('filter_coaches',{filter:t})}}>{coaches.find(c=>c.coach_level===t)?.coach_level_name || t}</button>)}</div><label className="region-control">Pricing region<select value={region} onChange={e=>setCountryCode(e.target.value)}><option value="DOMESTIC">India · INR</option><option value="INTERNATIONAL">International · USD</option></select></label></div>
 <div className="directory-search"><label><span>Search coaches</span><input type="search" placeholder="Name or specialty" value={query} onChange={e=>setQuery(e.target.value)} data-clarity-mask="true"/></label><label><span>Your focus</span><select value={goal} onChange={e=>{setGoal(e.target.value);trackEvent('filter_coaches',{filter:e.target.value})}}><option value="all">All specialties</option><option value="weight loss">Weight loss</option><option value="strength">Strength training</option><option value="nutrition">Nutrition</option><option value="habit">Healthy habits</option></select></label><span className="results-count" aria-live="polite">{filtered.length} {filtered.length===1?'coach':'coaches'}</span></div>
 {error && (import.meta.env.DEV ? <p className="preview-notice" role="status">Local preview: coach information from the supplied project. Connect the backend for current prices, availability, and booking.</p> : <div className="empty-state" role="alert"><h2>We couldn’t load our coaches.</h2><p>Please try again in a moment.</p><button className="button" onClick={()=>setRetry(r=>r+1)}>Try again</button></div>)}
 {loading ? <div className="skeleton-grid" aria-label="Loading coaches">{[1,2,3].map(n=><div className="skeleton" key={n}/>)}</div> : <div className="directory-grid">{filtered.map(coach=>{
 const pricePlans=plans.filter(p=>p.category?.coach_level?.toLowerCase()===coach.coach_level?.toLowerCase() && p.category?.location?.toUpperCase()===region && Number(p.duration_weeks)>0 && Number(p.price)>0);
 const minimum=pricePlans.length?Math.min(...pricePlans.map(p=>Math.ceil(Number(p.price)/Number(p.duration_weeks)))):null;
 const slug=coachSlug(coach);
 return <article className={`directory-card ${slug===featuredSlug?'is-featured-coach':''}`} id={`coach-${slug}`} tabIndex={-1} key={coach.id}><Link className="coach-photo" to={`/coaches/${encodeURIComponent(slug)}`} state={{coach,coupleMode:Boolean(location.state?.coupleMode)}} aria-label={`View ${coach.name}’s profile`} onClick={()=>trackCoachEvent('select_coach',coach,{source:'directory_photo',pricing_region:region})}><CoachPortrait coach={coach} /><span className="tier-badge">{coach.coach_level_name||coach.coach_level||'Coach'}</span><span className="photo-arrow" aria-hidden="true">↗</span></Link><div className="coach-card-body"><h2><Link to={`/coaches/${encodeURIComponent(slug)}`} state={{coach,coupleMode:Boolean(location.state?.coupleMode)}} onClick={()=>trackCoachEvent('select_coach',coach,{source:'directory_name',pricing_region:region})}>{coach.name}</Link></h2><CoachSpecialties value={coach.specializations || coach.tags} /><p className="coach-card-description">{coach.tagline||coach.previous_work||'Work together on a routine that fits your goals and your life.'}</p><div className="coach-card-bottom"><div>{minimum?<><span>Plans from</span><strong>{region==='DOMESTIC'?'₹':'$'}{minimum.toLocaleString()}<small> / week</small></strong></>:<span>Personalized coaching</span>}</div><Link className="text-link" to={`/coaches/${encodeURIComponent(slug)}`} state={{coach,coupleMode:Boolean(location.state?.coupleMode)}} onClick={()=>trackCoachEvent('select_coach',coach,{source:'directory_button',pricing_region:region})}>View profile ↗</Link></div>{coachLandings[slug] && <Link className="directory-landing-link" to={`/lp/${slug}`} onClick={()=>trackCoachEvent('cta_click',coach,{source:'directory_landing'})}>His story, coaching & plans ↗</Link>}</div></article>
 })}</div>}
 {!loading&&!error&&filtered.length===0&&<div className="empty-state"><h2>No matches just yet.</h2><p>Try another name or specialty.</p><button className="button button-outline" onClick={()=>{setTier('all');setGoal('all');setQuery('')}}>Clear filters</button></div>}
 </section><section className="start-banner wrap"><p className="eyebrow">A plan for your next chapter</p><h2>Know what<br/>you’re signing up for.</h2><Link className="button button-outline" to="/plans">Explore coaching plans ↗</Link></section></>;
}
