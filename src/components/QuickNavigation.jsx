import { scrollToSection } from '../scroll/smoothScroll';
import { useEffect, useState } from 'react';
import { trackEvent } from '../analytics/analytics';
import '../styles/quick-navigation.css';
const homeLinks=[['home-overview','Back to top'],['the-trufit-way','Our approach'],['home-programs','Coaching options'],['home-start','Getting started'],['faq','FAQs'],['contact-form','Contact us']];
const shortLabels={'home-overview':'Top','the-trufit-way':'Why us','home-programs':'Plans','home-start':'Start','faq':'FAQs','contact-form':'Talk','coach-overview':'Coach','cpx-plans':'Plans','coach-about':'About','coach-next':'Start','coach-faq':'FAQs'};
const coachLinks=[['coach-overview','Coach overview'],['cpx-plans','Coaching plans'],['coach-about','About your coach'],['coach-next','Getting started'],['coach-faq','FAQs']];
export default function QuickNavigation({coachPage=false}){
 const links=coachPage?coachLinks:homeLinks;
 const [active,setActive]=useState(links[0][0]);
 useEffect(()=>{
  let frame;
  const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{let current=links[0][0];for(const [id] of links){const node=document.getElementById(id);if(node&&node.getBoundingClientRect().top<innerHeight*.4)current=id}setActive(current)})};
  update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
  const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(update);
  const main=document.getElementById('main-content');if(main)observer?.observe(main);
  return()=>{cancelAnimationFrame(frame);observer?.disconnect();window.removeEventListener('scroll',update);window.removeEventListener('resize',update)};
 },[links]);
 const jump=(event,id)=>{
  const target=document.getElementById(id);if(!target)return;
  event.preventDefault();setActive(id);
  scrollToSection(target);
  target.focus({preventScroll:true});
  trackEvent('cta_click',{source:'quick_navigation',section:id});
 };
 return <nav className="section-rail" aria-label="Quick section navigation">
  {links.map(([id,label])=><a key={id} href={`#${id}`} aria-label={`Go to ${label.toLowerCase()}`} aria-current={active===id?'location':undefined} onClick={event=>jump(event,id)}><span className="rail-stop" aria-hidden="true">{shortLabels[id]}</span></a>)}
 </nav>;
}
