import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { openPrivacyPreferences } from '../analytics/analytics';
import logo from '../assets/logo-original.svg';
import wordmark from '../assets/footer-logo-text.svg';
import whatsAppLogo from '../assets/whatsapp-official.svg';
import coachImage from '../assets/coach-srikar.webp';
import strengthImage from '../assets/coach-nikhil.webp';
import ruthwikImage from '../assets/coach-ruthwik.webp';
import vrishankaImage from '../assets/coach-vrishanka.webp';
import vishwaImage from '../assets/coach-vishwa.webp';
import heroVideo from '../assets/hero-video.mp4';
import heroMobileVideo from '../assets/hero-video-mobile.mp4';
import heroPoster from '../assets/hero-video-poster.webp';
import togetherImage from '../assets/hero-cover.webp';
import habitsImage from '../assets/our-promise.webp';
import nutritionImage from '../assets/about-hero.webp';
import '../components/home/AxisHome.css';

function Icon({ type = 'person', ...props }) {
 const paths = {
  mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/></>,
  person: <><circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/></>,
  people: <><circle cx="9" cy="7" r="3"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M16 4a3 3 0 0 1 0 6m3 4a6 6 0 0 1 3 5v2"/></>,
  strength: <><path d="M3 8v8m4-11v14M17 5v14m4-11v8M7 12h10"/></>,
  food: <><path d="M5 3v7m3-7v7m-6-7v7a3 3 0 0 0 6 0M5 13v8M18 3c-4 3-4 9 0 10h2V3h-2Zm2 10v8"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-14 4h3m4 0h3"/></>,
  check: <path d="m5 12 4 4L20 5"/>,
  book: <><path d="M12 6c-3-3-6-3-10-2v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-4-1-7-1-10 2Zm0 0v15"/></>,
  heart: <path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 2 11 8 15 6-4 13-10 8-15Z"/>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/></>,
  search: <><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></>,
  arrow: <path d="m9 5 7 7-7 7"/>,
 };
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[type] || paths.person}</svg>;
}
const sections = [
 { id:'home-programs', label:'Individual coaching', short:'Individual', eyebrow:'better everyday fitness', title:'A coaching plan that fits your starting point', image:coachImage, alt:'Tru Fit coach Srikar Peddapally', articles:[['Your first steps with a fitness coach','getting-started-with-a-coach'],['How to compare coaching programs','compare-coaching-programs']], tiles:[['person','Personal coaching','For your own goals','/coaches'],['strength','Strength training','Build your routine','/coaches?focus=strength'],['heart','Weight management','Support at every step','/coaches?focus=weight-loss'],['calendar','Consultation','Start with a conversation','/coaches/jaswant-medidi']] },
 { id:'home-couple', label:'Couple coaching', short:'Couple', eyebrow:'moving forward together', title:'Two individual goals. One shared starting point.', image:togetherImage, alt:'People talking with a fitness coach from home', articles:[['Coaching for two, with room for each of you','starting-couple-coaching'],['Make room for training in a busy week','make-room-for-training']], tiles:[['people','A shared start','Choose your coach together','/coaches'],['person','Individual plans','Room for each of you','/coaches'],['food','Food preferences','Fit your household routine','/blog/food-preferences-and-your-plan'],['calendar','Shared check-ins','Stay in the conversation','/blog/make-your-check-in-useful']] },
 { id:'home-strength', label:'Strength training', short:'Strength', eyebrow:'training with a purpose', title:'Find the support for the way you want to train', image:strengthImage, alt:'Tru Fit coach Nikhil Valaboju', articles:[['Make room for training in a busy week','make-room-for-training'],['A check-in that helps your coach help you','make-your-check-in-useful']], tiles:[['strength','Gym training','Use the equipment you have','/coaches?focus=strength'],['person','Beginner fitness','Build your confidence','/coaches?focus=beginner'],['calendar','A practical schedule','Make space in your week','/blog/make-room-for-training'],['check','Regular feedback','Adjust as you progress','/blog/make-your-check-in-useful']] },
 { id:'home-nutrition', label:'Nutrition', short:'Nutrition', eyebrow:'food that fits real life', title:'Nutrition guidance shaped around your preferences', image:nutritionImage, alt:'Everyday wellbeing and fitness', articles:[['Your food preferences belong in the plan','food-preferences-and-your-plan'],['Bring your real routine to your first check-in','make-your-check-in-useful']], tiles:[['food','Everyday meals','Make preferences part of it','/coaches?focus=nutrition'],['people','Household routines','Find your shared rhythm','/blog/starting-couple-coaching'],['book','Food conversations','Give your coach the context','/blog/food-preferences-and-your-plan'],['phone','Your diet plan','Keep the details together','/portal/profile']] },
 { id:'home-habits', label:'Healthy habits', short:'Habits', eyebrow:'consistency over perfection', title:'Small, practical steps you can keep coming back to', image:habitsImage, alt:'Building a sustainable fitness routine', articles:[['Make your next training week easier to follow','make-room-for-training'],['Leave every check-in with a clear next step','make-your-check-in-useful']], tiles:[['calendar','A realistic routine','Start with the week you have','/blog/make-room-for-training'],['heart','Ongoing support','A human in your corner','/coaches'],['check','Useful check-ins','Keep the feedback flowing','/blog/make-your-check-in-useful'],['book','Helpful reading','Learn at your own pace','/blog']] },
];
function Brand({ light = false }) { return <Link to="/" className={`ah-brand${light?' ah-brand-light':''}`} aria-label="Tru Fit home"><img src={logo} alt=""/><img src={wordmark} alt=""/></Link>; }
function useMotionEnvironment(ref) {
 const [reducedMotion,setReducedMotion]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [inView,setInView]=useState(false);
 const [documentVisible,setDocumentVisible]=useState(()=>typeof document==='undefined'||!document.hidden);
 useEffect(()=>{const query=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReducedMotion(query.matches);query.addEventListener('change',change);return()=>query.removeEventListener('change',change)},[]);
 useEffect(()=>{const change=()=>setDocumentVisible(!document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change)},[]);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>setInView(entries.some(entry=>entry.isIntersecting)),{threshold:.05});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect()},[ref]);
 return {reducedMotion,canAnimate:!reducedMotion&&inView&&documentVisible};
}
const portraitSlides=[
 {name:'Srikar Peddapally',image:coachImage},
 {name:'Nikhil Valaboju',image:strengthImage},
 {name:'Ruthwik Reddy',image:ruthwikImage},
 {name:'Vrishanka Viswanathan',image:vrishankaImage},
 {name:'Vishwa',image:vishwaImage},
];
function CoachPortraitCarousel(){
 const containerRef=useRef(null);const {reducedMotion,canAnimate}=useMotionEnvironment(containerRef);
 const [index,setIndex]=useState(0);const [animate,setAnimate]=useState(true);
 useEffect(()=>{if(!canAnimate)return;const interval=setInterval(()=>setIndex(current=>current>=portraitSlides.length?1:current+1),2000);return()=>clearInterval(interval)},[canAnimate]);
 useEffect(()=>{if(animate)return;let secondFrame;const frame=requestAnimationFrame(()=>{secondFrame=requestAnimationFrame(()=>setAnimate(true))});return()=>{cancelAnimationFrame(frame);cancelAnimationFrame(secondFrame)}},[animate]);
 const resetLoop=()=>{if(index===portraitSlides.length){setAnimate(false);setIndex(0)}};
 return <div ref={containerRef} className="ah-coach-carousel" role="region" aria-roledescription="carousel" aria-label="Meet Tru Fit coaches">
  <div className="ah-coach-track" style={{transform:`translateX(-${index*100}%)`,transition:animate&&!reducedMotion?undefined:'none'}} onTransitionEnd={resetLoop}>
   {[...portraitSlides,portraitSlides[0]].map((coach,i)=><div key={`${coach.name}-${i}`} className="ah-coach-slide" aria-hidden={i!==index}><img src={coach.image} alt={`Tru Fit coach ${coach.name}`} loading="lazy"/><span>{coach.name}</span></div>)}
  </div>

 </div>;
}
function HomeHero(){
 const heroRef=useRef(null);const videoRef=useRef(null);const {reducedMotion,canAnimate}=useMotionEnvironment(heroRef);
 useEffect(()=>{const video=videoRef.current;if(!video)return;if(canAnimate)video.play().catch(()=>{});else video.pause()},[canAnimate,reducedMotion]);
 return <section ref={heroRef} className="ah-hero ah-video-hero" id="home-overview" tabIndex={-1} aria-labelledby="home-title" style={{backgroundImage:`url(${heroPoster})`}}>{!reducedMotion&&<video ref={videoRef} className="ah-hero-video" autoPlay muted loop playsInline poster={heroPoster} preload="metadata" aria-hidden="true"><source src={heroMobileVideo} type="video/mp4" media="(max-width: 760px)"/><source src={heroVideo} type="video/mp4"/></video>}<div className="ah-container"><h1 id="home-title"><em>open</em> to your potential<br/><em>open</em> to a healthier everyday</h1><p>A real coach. A clear plan. Support for your everyday life.</p><div className="ah-mobile-hero-actions"><Link className="ah-button ah-button-light" to="/blog">Explore learning hub</Link><Link className="ah-button" to="/coaches">Explore coaching</Link></div></div></section>;
}
const quickActions=[['person','Individual coaching','/coaches'],['people','Couple coaching','/coaches'],['calendar','Consultation','/coaches/jaswant-medidi'],['food','Nutrition coaching','/coaches?focus=nutrition'],['strength','Strength training','/coaches?focus=strength'],['phone','Member portal','/portal']];
const promotions=[{title:'A little support. A lot of possibility.',copy:'Personal coaching, built around you.',image:togetherImage,link:'/coaches',cta:'Explore coaching'},{title:'Make your next step a shared one.',copy:'Individual goals. A coach for both of you.',image:nutritionImage,link:'/coaches',cta:'Discover couple coaching'},{title:'Your routine, all in one place.',copy:'Your program, diet plan and check-ins.',image:habitsImage,link:'/portal',cta:'Explore your portal'}];
function useHomeCarousel(count, delay) {
 const ref=useRef(null);const {reducedMotion,canAnimate}=useMotionEnvironment(ref);
 const [index,setIndex]=useState(1);const [animate,setAnimate]=useState(true);
 const [hovered,setHovered]=useState(false);const [focused,setFocused]=useState(false);const [interaction,setInteraction]=useState(0);
 const transitionRunning=useRef(false);const resumeAt=useRef(0);const gesture=useRef(null);const suppressClickUntil=useRef(0);
 const active=(index-1+count)%count;
 const move=(direction,manual=true)=>{
  if(transitionRunning.current)return;
  if(manual){resumeAt.current=Date.now()+6000;setInteraction(value=>value+1)}
  if(reducedMotion){setIndex(current=>((current-1+direction+count)%count)+1);return}
  transitionRunning.current=true;setIndex(current=>Math.max(0,Math.min(count+1,current+direction)));
 };
 const choose=page=>{
  if(transitionRunning.current)return;
  resumeAt.current=Date.now()+6000;setInteraction(value=>value+1);
  if(page!==active){transitionRunning.current=!reducedMotion;setIndex(page+1)}
 };
 useEffect(()=>{
  if(!canAnimate||hovered||focused)return;
  const timer=setInterval(()=>{if(Date.now()<resumeAt.current||transitionRunning.current)return;transitionRunning.current=true;setIndex(current=>current>=count+1?2:current+1)},delay);
  return()=>clearInterval(timer);
 },[canAnimate,count,delay,hovered,focused,interaction]);
 useEffect(()=>{if(animate)return;let second;const frame=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>setAnimate(true))});return()=>{cancelAnimationFrame(frame);cancelAnimationFrame(second)}},[animate]);
 const end=event=>{
  if(event.target!==event.currentTarget||event.propertyName!=='transform')return;
  transitionRunning.current=false;
  if(index===0||index===count+1){setAnimate(false);setIndex(index===0?count:1)}
 };
 const resetGesture=()=>{gesture.current=null};
 const handlers={
  onPointerEnter:event=>{if(event.pointerType==='mouse')setHovered(true)},
  onPointerLeave:()=>setHovered(false),
  onFocusCapture:()=>setFocused(true),
  onBlurCapture:event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false)},
  onPointerDown:event=>{if(event.button!==0||event.target.closest('button'))return;gesture.current={x:event.clientX,y:event.clientY,id:event.pointerId,horizontal:false};resumeAt.current=Date.now()+6000},
  onPointerMove:event=>{const current=gesture.current;if(!current||current.id!==event.pointerId)return;const dx=event.clientX-current.x,dy=event.clientY-current.y;if(!current.horizontal&&Math.abs(dy)>14&&Math.abs(dy)>Math.abs(dx)){resetGesture();return}if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.2){current.horizontal=true;event.preventDefault();event.currentTarget.setPointerCapture?.(event.pointerId)}},
  onPointerUp:event=>{const current=gesture.current;if(!current||current.id!==event.pointerId)return;const dx=event.clientX-current.x;if(current.horizontal){suppressClickUntil.current=Date.now()+600;if(Math.abs(dx)>32)move(dx<0?1:-1)}resetGesture()},
  onPointerCancel:resetGesture,
  onClickCapture:event=>{if(Date.now()<suppressClickUntil.current){event.preventDefault();event.stopPropagation()}},
  onKeyDown:event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();if(event.target.closest('a'))event.currentTarget.focus();if(event.key==='Home')choose(0);else if(event.key==='End')choose(count-1);else move(event.key==='ArrowRight'?1:-1)},
 };
 return {ref,index,active,move,choose,handlers,track:{style:{transform:`translateX(-${index*100}%)`,transition:animate&&!reducedMotion?undefined:'none'},onTransitionEnd:end,onTransitionCancel:end}};
}
function QuickActions(){
 const [mobile,setMobile]=useState(()=>window.matchMedia('(max-width: 760px)').matches);
 useEffect(()=>{const query=window.matchMedia('(max-width: 760px)');const update=()=>setMobile(query.matches);query.addEventListener('change',update);return()=>query.removeEventListener('change',update)},[]);
 const groups=mobile?[quickActions.slice(0,4),[...quickActions.slice(4),...quickActions.slice(0,2)]]:[quickActions.slice(0,3),quickActions.slice(3)];
 const actions=useHomeCarousel(groups.length,3600);const highlights=useHomeCarousel(promotions.length,4000);
 const actionSlides=[groups[groups.length-1],...groups,groups[0]];const promoSlides=[promotions[promotions.length-1],...promotions,promotions[0]];
 return <section className="ah-quick ah-container" aria-label="Get started with Tru Fit">
  <div ref={actions.ref} className="ah-apply ah-actions-carousel" role="region" aria-roledescription="carousel" aria-label="Coaching options" tabIndex={0} {...actions.handlers}>
   <h2>Get started</h2><div className="ah-actions-viewport"><div className="ah-motion-track" {...actions.track}>{actionSlides.map((group,i)=><div className="ah-action-slide" key={i} aria-hidden={i!==actions.index} inert={i!==actions.index}>{group.map(([icon,label,to])=><Link key={label} to={to} draggable={false} state={label==='Couple coaching'?{coupleMode:true}:undefined}><span><Icon type={icon}/></span>{label}</Link>)}</div>)}</div></div>
  </div>
  <div ref={highlights.ref} className="ah-promo ah-highlights-carousel" role="region" aria-roledescription="carousel" aria-label="Tru Fit highlights" tabIndex={0} {...highlights.handlers}>
   <div className="ah-motion-track" {...highlights.track}>{promoSlides.map((promo,i)=><div className="ah-promo-slide" key={i} aria-hidden={i!==highlights.index} inert={i!==highlights.index}><img src={promo.image} alt="" draggable={false}/><div className="ah-promo-copy"><h2>{promo.title}</h2><p>{promo.copy}</p><Link className="ah-button" to={promo.link} draggable={false} state={promo===promotions[1]?{coupleMode:true}:undefined}>{promo.cta}</Link></div></div>)}</div>
  </div>
 </section>;
}
function SectionRail(){
 const {user}=useAuth();
 const [active,setActive]=useState(sections[0].id);
 const [docked,setDocked]=useState(false);const sentinelRef=useRef(null);
 useEffect(()=>{
  const sentinel=sentinelRef.current;const desktop=window.matchMedia('(min-width: 1001px)');
  if(!sentinel)return;
  // Measure the natural boundary, never the rail's changing sticky position.
  const update=()=>setDocked(desktop.matches&&sentinel.getBoundingClientRect().top<=0);
  const observer=new IntersectionObserver(update,{threshold:[0,1]});
  observer.observe(sentinel);desktop.addEventListener('change',update);update();
  return()=>{observer.disconnect();desktop.removeEventListener('change',update)};
 },[]);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id)},{rootMargin:'-18% 0px -60% 0px'});[...sections.map(s=>s.id),'home-digital'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el)});return()=>observer.disconnect()},[]);
 return <><span ref={sentinelRef} className="ah-rail-sentinel" aria-hidden="true"/><nav className={`ah-section-rail${docked?' is-docked':''}`} aria-label="Explore coaching sections"><div className="ah-rail-inner"><div className="ah-rail-brand"><Brand/></div><div className="ah-rail-links">{[...sections.map(s=>[s.id,s.short]),['home-digital','Your portal']].map(([id,label])=><a key={id} href={`#${id}`} aria-current={active===id?'location':undefined}>{label}</a>)}</div><div className="ah-rail-account"><Link to="/coaches">Coaching</Link><Link to={user?'/portal':'/signin'} aria-label={user?'My account':'Sign in or sign up'}><Icon type="person"/><span>{user?'My account':'Sign in / Sign up'}</span></Link></div></div></nav></>;
}
function CoachingSection({section:s,index}){
 return <section id={s.id} tabIndex={-1} className={`ah-coaching ah-container${index%2?' ah-reverse':''}`} aria-labelledby={`${s.id}-title`}><div className="ah-editorial"><div className="ah-article-copy"><h2><em>open</em> to {s.eyebrow}</h2><div>{s.articles.map(([title,slug])=><Link key={slug} to={`/blog/${slug}`}>{title}</Link>)}</div><Link className="ah-learn" to="/blog">Learn more</Link></div>{index===0?<CoachPortraitCarousel/>:<img src={s.image} alt={s.alt} loading="lazy"/>}</div><div className="ah-product"><div className="ah-product-heading"><h3 id={`${s.id}-title`}>{s.title}</h3><div><Link className="ah-button ah-button-light" to={s.id==='home-couple'?'/coaches':'/findmycoach'} state={s.id==='home-couple'?{coupleMode:true}:undefined}>Get started</Link><Link className="ah-button ah-button-light" to="/coaches" state={s.id==='home-couple'?{coupleMode:true}:undefined}>Explore more</Link></div></div><div className="ah-product-tiles">{s.tiles.map(([icon,title,desc,to])=><Link key={title} to={to} state={s.id==='home-couple'?{coupleMode:true}:undefined}><span className="ah-tile-icon"><Icon type={icon}/></span><span><strong>{title}</strong><small>{desc}</small></span><Icon type="arrow"/></Link>)}</div></div></section>;
}
function SupportPromos(){
 return <section className="ah-support-promos ah-container" aria-label="Member support and referrals"><div className="ah-easy"><h2>Coaching made effortless</h2><p>A single place for the details that matter.</p><div>{[['calendar','Your program','/portal/program'],['food','Fitness & diet','/portal/profile'],['book','Your invoices','/portal/invoices'],['phone','View all','/portal']].map(([icon,label,to])=><Link to={to} key={label}><Icon type={icon}/><span>{label}</span></Link>)}</div></div><div className="ah-reward"><div><h2>Progress feels better together</h2><p>Invite a friend to discover their next step.</p><Link to="/portal/referrals" className="ah-learn">Explore referrals</Link></div><div className="ah-referral-art" aria-hidden="true"><span><Icon type="person"/></span><i>+</i><span><Icon type="people"/></span></div></div></section>;
}
function DigitalPortal(){return <section className="ah-digital" id="home-digital" tabIndex={-1}><div className="ah-container"><h2>The best of your coaching is now <em>connected</em></h2><p>Your Tru Fit member portal keeps your everyday details together. <Link to="/portal">Explore your portal</Link></p><div className="ah-digital-scene"><div className="ah-digital-features ah-features-left"><span><Icon type="calendar"/>Your coaching program</span><span><Icon type="food"/>Diet plans & preferences</span><span><Icon type="heart"/>Fitness measurements</span></div><div className="ah-phone"><div className="ah-phone-speaker"/><div className="ah-phone-top"><Brand/><span>BM</span></div><div className="ah-phone-welcome"><small>Your next step starts here</small><strong>Hi, Bheemesh.</strong><span>A little better. Every day.</span></div><div className="ah-phone-metrics"><span><strong>01</strong>Your coach</span><span><strong>03</strong>Simple steps</span></div><div className="ah-phone-program"><small>Your program</small><strong>Personal coaching</strong><span>A plan built around you</span><div/></div><div className="ah-phone-shortcuts"><span><Icon type="food"/>My health</span><span><Icon type="book"/>Invoices</span><span><Icon type="people"/>Referrals</span></div><small className="ah-phone-preview">Illustrative portal preview</small></div><div className="ah-digital-features ah-features-right"><span><Icon type="book"/>Invoices in one place</span><span><Icon type="strength"/>Team-picked essentials</span><span><Icon type="people"/>Invite your friends</span></div></div></div></section>}
function ImpactAndSafety(){return <><section className="ah-impact ah-container"><div><h2><em>open</em> to your next chapter</h2><p>Personal coaching. Room for real life.</p><div className="ah-impact-numbers"><span><strong>1</strong>A coach in your corner</span><span><strong>2</strong>Individual & couple formats</span><span><strong>3</strong>Steps to get started</span></div><Link className="ah-button ah-button-light" to="/findmycoach">Find your starting point</Link></div><div className="ah-impact-art"><img src={togetherImage} alt="People connecting with a fitness coach" loading="lazy"/></div></section><section className="ah-safety ah-container"><div className="ah-safety-icon"><Icon type="heart"/></div><div><p>Share your experience, preferences, and any relevant health considerations with your coach before you begin.</p><Link className="ah-button" to="/blog/getting-started-with-a-coach">Know more</Link></div></section></>}
const footerGroups=[['Get in touch',[['Contact Tru Fit','mailto:support@betrufit.com'],['support@betrufit.com','mailto:support@betrufit.com'],['+91 72072 59556','tel:+917207259556'],['Find your coach','/findmycoach'],['Member support','/portal']]],['Your coaching',[['Individual coaching','/coaches'],['Couple coaching','/coaches'],['Strength training','/coaches?focus=strength'],['Nutrition coaching','/coaches?focus=nutrition'],['Beginner fitness','/coaches?focus=beginner']]],['Learning hub',[['Getting started','/blog/getting-started-with-a-coach'],['Training & routines','/blog/make-room-for-training'],['Food preferences','/blog/food-preferences-and-your-plan'],['Compare programs','/blog/compare-coaching-programs'],['All articles','/blog']]],['Member services',[['Your program','/portal/program'],['Fitness & diet','/portal/profile'],['Training essentials','/portal/products'],['Invoices','/portal/invoices'],['Referrals','/portal/referrals']]],['Useful links',[['Calorie calculator','/calorie-calculator'],['Coach matching','/findmycoach'],['Privacy policy','/privacy-policy'],['Terms & conditions','/terms-conditions'],['Refund policy','/refund-policy']]]];
function LocalLink({to,children,...props}){return /^(mailto:|tel:|https:)/.test(to)?<a href={to} {...props}>{children}</a>:<Link to={to} {...props}>{children}</Link>}
function HomeFooter(){return <footer className="ah-footer" id="home-support" tabIndex={-1}><span id="contact-form" tabIndex={-1} className="ah-contact-anchor"/><div className="ah-container"><div className="ah-footer-columns">{footerGroups.map(([title,links])=><div key={title}><h2>{title}</h2>{links.map(([label,to])=><LocalLink key={label} to={to} state={label==='Couple coaching'?{coupleMode:true}:undefined}>{label}</LocalLink>)}</div>)}</div><div className="ah-footer-mobile">{footerGroups.map(([title,links])=><details key={title}><summary>{title}<span aria-hidden="true">+</span></summary><div>{links.map(([label,to])=><LocalLink key={label} to={to} state={label==='Couple coaching'?{coupleMode:true}:undefined}>{label}</LocalLink>)}</div></details>)}</div><div className="ah-footer-offerings"><strong>Our offerings:</strong>{sections.map(s=><a href={`#${s.id}`} key={s.id}>{s.label}</a>)}<Link to="/portal">Member portal</Link><Link to="/calorie-calculator">Calorie calculator</Link></div><div className="ah-footer-note">Fitness coaching shaped around your starting point, preferences, and everyday routine. Review your chosen coach’s program details and terms before booking.</div><div className="ah-footer-social"><span>Follow us on:</span><a href="https://www.instagram.com/betrufit/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://www.linkedin.com/company/tru-fit/" target="_blank" rel="noopener noreferrer">LinkedIn</a><Brand/></div><div className="ah-footer-bottom"><span>© {new Date().getFullYear()} Tru Fit. All rights reserved.</span><div><Link to="/privacy-policy">Privacy</Link><Link to="/terms-conditions">Terms</Link><Link to="/refund-policy">Refunds</Link><button type="button" onClick={openPrivacyPreferences}>Cookie preferences</button></div></div></div></footer>}
export default function HomePage(){
 const [showSticky,setShowSticky]=useState(false);
 useEffect(()=>{const update=()=>setShowSticky(window.scrollY>900);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);
 return <div className="axis-home"><HomeHero/><QuickActions/><SectionRail/><div className="ah-sections">{sections.map((section,index)=><CoachingSection key={section.id} section={section} index={index}/>)}</div><SupportPromos/><DigitalPortal/><ImpactAndSafety/><HomeFooter/><a className="ah-chat-float" href="https://wa.me/917207259556" target="_blank" rel="noopener noreferrer" aria-label="Chat with Tru Fit on WhatsApp (opens in a new tab)"><img src={whatsAppLogo} alt=""/></a>{showSticky&&<div className="ah-sticky-start"><span><Icon type="person"/></span><p>Find a coach who understands your goals</p><Link to="/findmycoach" className="ah-button">Get started</Link></div>}</div>;
}
