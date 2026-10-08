let engine=null;
export function setScrollEngine(instance){engine=instance}
export function scrollToSection(target){
 if(!target)return;
 if(engine){engine.resize();engine.scrollTo(target,{duration:.85});return}
 target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}
