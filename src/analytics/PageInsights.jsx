import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics, trackEvent } from './analytics';
import { isPrivatePath } from './core.mjs';
export default function PageInsights(){
 const {pathname,state,key}=useLocation();
 useLayoutEffect(()=>{if(isPrivatePath(pathname))analytics.page(pathname,document.title)},[pathname]);
 useEffect(()=>{
  if(isPrivatePath(pathname))return;
  const frame=requestAnimationFrame(()=>{
   analytics.page(pathname,document.title);
   if(pathname==='/coaches' && state?.fromQuestionnaire){
    try{if(sessionStorage.getItem('trufit_quiz_completion')!==key){trackEvent('quiz_complete',{source:'coach_match'});sessionStorage.setItem('trufit_quiz_completion',key)}}catch{ /* Storage can be unavailable in private browsing. */ }
   }
  });
  const seenDepths=new Set(),startedForms=new WeakSet();
  let framePending=false;
  const click=e=>{const target=e.target.closest?.('[data-track]');if(target)trackEvent(target.dataset.track,{source:target.dataset.source||'site'})};
  const focus=e=>{const form=e.target.closest?.('form[data-form-id]');if(form&&!startedForms.has(form)){startedForms.add(form);trackEvent('form_start',{form_id:form.dataset.formId})}};
  const onScroll=()=>{if(framePending)return;framePending=true;requestAnimationFrame(()=>{framePending=false;const height=document.documentElement.scrollHeight-window.innerHeight;if(height<100)return;const depth=Math.round(window.scrollY/height*100);for(const n of [25,50,75,90])if(depth>=n&&!seenDepths.has(n)){seenDepths.add(n);trackEvent('scroll_depth',{percent_scrolled:n})}})};
  document.addEventListener('click',click);document.addEventListener('focusin',focus);window.addEventListener('scroll',onScroll,{passive:true});
  return()=>{cancelAnimationFrame(frame);document.removeEventListener('click',click);document.removeEventListener('focusin',focus);window.removeEventListener('scroll',onScroll)};
 },[pathname,key,state?.fromQuestionnaire]);
 return null;
}
