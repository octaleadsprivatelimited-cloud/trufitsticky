import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { trackCoachEvent } from '../analytics/analytics';
import { fetchCatalog, coachSlug } from './coaches/catalog';
import Nikhil from '../assets/coach-nikhil.webp';
import Ruthwik from '../assets/coach-ruthwik.webp';
import Vrishanka from '../assets/coach-vrishanka.webp';
import Srikar from '../assets/coach-srikar.webp';

const MotionLink = motion.create(Link);
const lineup = [
 {id:3,name:'Nikhil Valaboju',profile_slug:'nikhil-valaboju',coach_level:'senior',image:Nikhil,color:'lavender'},
 {id:4,name:'Vrishanka Viswanathan',profile_slug:'vrishanka-viswanathan',coach_level:'junior',image:Vrishanka,color:'orange'},
 {id:6,name:'Ruthwik Reddy',profile_slug:'ruthwik-reddy',coach_level:'senior',image:Ruthwik,color:'green'},
 {id:2,name:'Srikar Peddapally',profile_slug:'srikar-peddapally',coach_level:'senior',image:Srikar,color:'pink'},
];
const destination = coach => `/coaches#coach-${coach.profile_slug}`;
function shuffle(previous) {
 const next = [...previous];
 for(let i=next.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[next[i],next[j]]=[next[j],next[i]]}
 if(next.length>1 && next.every((coach,i)=>coach.id===previous[i].id)) [next[0],next[1]]=[next[1],next[0]];
 return next;
}
export default function CoachShuffle(){
 const [catalogue,setCatalogue]=useState(lineup);
 const coaches=catalogue.slice(0,4);
 const advance=()=>setCatalogue(previous=>previous.length>4?[...previous.slice(4),...previous.slice(0,4)]:previous);
 useEffect(()=>{
  const controller=new AbortController();
  fetchCatalog('coach-profiles',controller.signal).then(rows=>{
   const available=rows.filter(coach=>coach.status!=='hard' && coach.is_active!==false).map((coach,i)=>({...coach,profile_slug:coachSlug(coach),color:['lavender','orange','green','pink'][i%4]}));
   if(available.length && !controller.signal.aborted){
    const first=lineup.map(coach=>available.find(item=>item.profile_slug===coach.profile_slug)).filter(Boolean);
    const rest=shuffle(available.filter(coach=>!first.some(item=>item.id===coach.id)));
    setCatalogue([...first,...rest]);
   }
  }).catch(()=>{});
  return()=>controller.abort();
 },[]);
 useEffect(()=>{catalogue.slice(4,8).forEach(coach=>{if(coach.image){const image=new Image();image.src=coach.image}})},[catalogue]);
 const [paused,setPaused]=useState(false),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[visible,setVisible]=useState(!document.hidden);
 const reducedMotion=useReducedMotion();
 useEffect(()=>{const update=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update)},[]);
 useEffect(()=>{if(paused||hovered||focused||!visible||reducedMotion)return;const timer=setInterval(()=>setCatalogue(previous=>previous.length>4?[...previous.slice(4),...previous.slice(0,4)]:previous),6000);return()=>clearInterval(timer)},[paused,hovered,focused,visible,reducedMotion]);
 const track = coach => trackCoachEvent('select_coach',coach,{source:'home_coach_shuffle'});
 return <div className="home-coach-lineup">
  <div className="people-strip" aria-label="Meet some of the Tru Fit coaches" onPointerEnter={event=>{if(event.pointerType==='mouse')setHovered(true)}} onPointerLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false)}}>
   <Link className="people-strip-backdrop" to={destination(coaches[0])} aria-label={`Browse coaches, starting with ${coaches[0].name}`} onClick={()=>track(coaches[0])}/>
   {coaches.map((coach,i)=><MotionLink layout={!reducedMotion} initial={false} animate={{rotate:reducedMotion?0:[-2,0,1.5,-1][i]}} transition={{layout:{duration:.65},rotate:{duration:reducedMotion?0:.4}}} whileHover={reducedMotion?undefined:{y:-6,rotate:0}} className={`people-photo ${coach.color}`} key={i} to={destination(coach)} aria-label={`Find ${coach.name} on the coaches page`} onClick={()=>track(coach)}>{coach.image?<motion.img key={coach.id} initial={{opacity:reducedMotion?1:0}} animate={{opacity:1}} transition={{duration:reducedMotion?0:.65}} src={coach.image} alt={`${coach.name}, Tru Fit coach`} fetchPriority={i===0?'high':undefined}/>:<span className="portrait-initials">{coach.name.split(' ').map(part=>part[0]).slice(0,2).join('')}</span>}<span>{coach.name.startsWith('Dr.')?coach.name.split(' ').slice(0,2).join(' '):coach.name.split(' ')[0]}<span aria-hidden="true">↗</span></span></MotionLink>)}
   <span className="people-sticker" aria-hidden="true">IN YOUR<br/>CORNER ↗</span>
  </div>
  <div className="people-shuffle-controls"><span>Tap a coach. Find your person. · {catalogue.length} coaches</span><div className="shuffle-actions">{catalogue.length>4&&<button type="button" onClick={advance}>Next coaches <span aria-hidden="true">→</span></button>}{!reducedMotion&&<button type="button" aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?'Resume shuffle':'Pause shuffle'} <span aria-hidden="true">{paused?'▷':'Ⅱ'}</span></button>}</div></div>
 </div>;
}
