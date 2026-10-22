let engine=null;
export function setScrollEngine(instance){engine=instance}
export function scrollToSection(target){
 if(!target)return;
 // A sticky card's visible rectangle moves; navigate to its natural flow marker.
 const marker=target.id && target.closest('.has-card-stack')?.querySelector(`[data-stack-for="${CSS.escape(target.id)}"]`);
 if(marker && getComputedStyle(marker).display!=='none')target=marker;
 if(engine){engine.resize();engine.scrollTo(target,{duration:.85});return}
 target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}
