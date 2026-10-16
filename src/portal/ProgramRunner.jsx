import { useId, useState } from 'react';
import './program-runner.css';

export default function ProgramRunner() {
  const [paused, setPaused] = useState(false);
  const id = useId().replaceAll(':','');
  const shirt = `${id}-shirt`, ground = `${id}-ground`;
  return <div className={`portal-program-runner ${paused ? 'is-paused' : ''}`}>
    <svg className="portal-runner-art" viewBox="0 0 180 180" fill="none" aria-hidden="true" focusable="false">
      <defs><linearGradient id={shirt} x1="83" y1="65" x2="110" y2="107" gradientUnits="userSpaceOnUse"><stop stopColor="#9b71ed"/><stop offset="1" stopColor="#6024bd"/></linearGradient><radialGradient id={ground}><stop stopColor="#a78bfa" stopOpacity=".35"/><stop offset="1" stopColor="#a78bfa" stopOpacity="0"/></radialGradient></defs>
      <circle cx="99" cy="88" r="63" fill="#eee5fc"/>
      <path d="M44 131a62 62 0 0 1 0-86M151 48a62 62 0 0 1 9 61" stroke="#d8c5f5" strokeLinecap="round"/>
      <ellipse className="portal-runner-shadow" cx="95" cy="164" rx="54" ry="7" fill={`url(#${ground})`}/>
      <g className="portal-runner-track" stroke="#d2bbf0" strokeWidth="2" strokeLinecap="round"><path d="M27 163h24M63 163h52M131 163h23"/><path className="portal-runner-dash" d="M36 151h18M143 151h12"/></g>
      <g className="portal-runner-trail" stroke="#b494e3" strokeWidth="2.5" strokeLinecap="round"><path d="M33 78h22M22 91h28M37 104h15"/></g>
      <g className="portal-runner-body">
        <g className="portal-runner-leg portal-runner-leg-back" stroke="#9064ca" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"><path d="M92 104v28"/><g className="portal-runner-shin portal-runner-shin-back"><path d="M92 132v23"/><path d="M91 155h13" stroke="#7041a8" strokeWidth="9"/><path d="M91 160h16" stroke="white" strokeWidth="3"/></g></g>
        <g className="portal-runner-arm portal-runner-arm-back" stroke="#b08ade" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"><path d="M100 74l-1 21 16-9"/><circle cx="115" cy="86" r="4" fill="#f0e4ff" strokeWidth="2"/></g>
        <path d="M100 62c10 2 12 9 9 20l-7 23c-6 4-13 4-20-1l9-29c2-8 4-11 9-13Z" fill={`url(#${shirt})`}/>
        <path d="m96 78-7 22" stroke="#c7a9f5" strokeWidth="3" strokeLinecap="round"/>
        <path d="m99 62 4-10" stroke="#eee0ff" strokeWidth="9" strokeLinecap="round"/>
        <circle cx="107" cy="43" r="12" fill="#f2e8ff" stroke="#6b35ad" strokeWidth="1.5"/>
        <path d="M95 43c-4-12 8-20 18-13 5 3 6 7 5 11l-6-5-12 4-2 7Z" fill="#42157c"/>
        <path d="m117 43 3 5-4 1" stroke="#6b35ad" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <g className="portal-runner-leg portal-runner-leg-front" stroke="#57229a" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"><path d="M92 104v28"/><g className="portal-runner-shin portal-runner-shin-front"><path d="M92 132v23"/><path d="M91 155h13" stroke="#42157c" strokeWidth="9"/><path d="M91 160h16" stroke="white" strokeWidth="3"/></g></g>
        <path d="m83 101 18 4" stroke="#6d28d9" strokeWidth="7" strokeLinecap="round"/>
        <g className="portal-runner-arm portal-runner-arm-front" stroke="#7135b5" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"><path d="M100 74l-1 21 16-9"/><circle cx="115" cy="86" r="4" fill="#f0e4ff" strokeWidth="2"/></g>
      </g>
    </svg>
    <button type="button" className="portal-runner-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume running animation' : 'Pause running animation'} title={paused ? 'Resume animation' : 'Pause animation'}><svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">{paused ? <path d="m7 4 9 6-9 6z"/> : <path d="M6 4h3v12H6zM12 4h3v12h-3z"/>}</svg></button>
  </div>;
}
