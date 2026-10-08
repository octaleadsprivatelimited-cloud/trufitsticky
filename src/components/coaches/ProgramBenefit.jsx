import { useEffect, useRef } from 'react';

function titleEmoji(title){
 const text=String(title||'').toLowerCase();
 if(/nutrition|meal|food|diet/.test(text))return '🥗';
 if(/intake|form|questionnaire/.test(text))return '📝';
 if(/assignment|review.*goal/.test(text))return '🤝';
 if(/contact|schedule|consultation|call/.test(text))return '📞';
 if(/creation|delivery/.test(text))return '📋';
 if(/training|workout|exercise/.test(text))return '🏋️';
 if(/progress|review|metric/.test(text))return '📈';
 if(/modification|adjust|update/.test(text))return '🔄';
 if(/support|communicat/.test(text))return '💬';
 if(/app|ai|digital/.test(text))return '📱';
 if(/start|begin/.test(text))return '🚀';
 return '✨';
}

export default function ProgramBenefit({title,children}){
 const details=useRef(null);
 useEffect(()=>{
  const mobile=window.matchMedia('(max-width:700px)');
  const update=()=>{if(details.current)details.current.open=!mobile.matches};
  update();mobile.addEventListener('change',update);
  return()=>mobile.removeEventListener('change',update);
 },[]);
 return <details className="program-benefit" ref={details}><summary><span className="benefit-title-row"><span className="benefit-title-emoji" aria-hidden="true">{titleEmoji(title)}</span><span className="card-plan-desc-title">{title}</span></span></summary><div className="program-benefit-body card-plan-desc-text">{children}</div></details>;
}
