import { useEffect, useRef } from 'react';

export default function ProgramBenefit({title,children}){
 const details=useRef(null);
 useEffect(()=>{
  const mobile=window.matchMedia('(max-width:700px)');
  const update=()=>{if(details.current)details.current.open=!mobile.matches};
  update();mobile.addEventListener('change',update);
  return()=>mobile.removeEventListener('change',update);
 },[]);
 return <details className="program-benefit" ref={details}><summary><span className="benefit-title-row"><span className="card-plan-desc-title">{title}</span></span></summary><div className="program-benefit-body card-plan-desc-text">{children}</div></details>;
}
