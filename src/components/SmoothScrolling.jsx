import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { scrollToSection, setScrollEngine } from '../scroll/smoothScroll';
import '../styles/scroll.css';

export default function SmoothScrolling(){
 const {pathname}=useLocation();
 useEffect(()=>{
  const engine=new Lenis({autoRaf:true,lerp:.12,smoothWheel:true,syncTouch:false,allowNestedScroll:true,autoToggle:true,respectReducedMotion:true,stopInertiaOnNavigate:true,
   prevent:node=>Boolean(node.closest?.('input,textarea,select,[role="dialog"],[aria-modal="true"],[class*="modal"],[data-lenis-prevent]'))||getComputedStyle(document.body).overflow==='hidden'
  });
  setScrollEngine(engine);
  const anchor=event=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const link=event.target.closest?.('a[href]');if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
   const url=new URL(link.href,location.href);
   if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!url.hash)return;
   let id;try{id=decodeURIComponent(url.hash.slice(1))}catch{return}
   const target=document.getElementById(id);if(!target)return;
   event.preventDefault();scrollToSection(target);target.focus({preventScroll:true});
  };
  document.addEventListener('click',anchor);
  return()=>{document.removeEventListener('click',anchor);setScrollEngine(null);engine.destroy()};
 },[pathname]);
 return null;
}
