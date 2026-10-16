import ProgramRunner from './ProgramRunner';

const illustrations = {
  profile: <><path d="M48 65 24 42c-16-17 7-37 24-19 17-18 40 2 24 19L48 65Z" fill="#ffffff1c" stroke="white" strokeWidth="2"/><path className="portal-hero-heartbeat" d="M18 45h18l7-15 10 29 7-14h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></>,
  products: <><path d="M24 31h48l5 44H19l5-44Z" fill="#ffffff20" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M36 34V24a12 12 0 0 1 24 0v10" stroke="white" strokeWidth="2" strokeLinecap="round"/><g className="portal-hero-lift" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M36 48v14m-5-11v8m29-11v14m5-11v8M37 55h22"/></g></>,
  referrals: <><circle cx="32" cy="29" r="9" fill="#ffffff24" stroke="white" strokeWidth="2"/><circle cx="66" cy="32" r="8" fill="#ffffff24" stroke="white" strokeWidth="2"/><path d="M13 65V55c0-17 38-17 38 0v10M56 48c13-3 25 3 25 12v7" stroke="white" strokeWidth="2" strokeLinecap="round"/><g className="portal-hero-connection"><circle cx="51" cy="70" r="13" fill="#8b5cf6" stroke="white" strokeWidth="2"/><path d="m45 70 4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></>,
  invoices: <><path d="M25 14h46v65l-8-5-8 5-8-5-8 5-7-5-7 5V14Z" fill="#ffffff20" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M36 28h24M36 36h16M36 44h21" stroke="#ffffffa6" strokeWidth="2" strokeLinecap="round"/><circle cx="57" cy="62" r="15" fill="#8b5cf6" stroke="white" strokeWidth="2"/><path className="portal-hero-check" d="m50 62 5 5 9-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></>,
};
export default function PortalPageHero({ type, title, description }) {
  return <header className={`portal-page-hero portal-page-hero-${type}`}><div className="portal-page-hero-copy"><h2>{title}</h2><p>{description}</p></div><div className="portal-page-hero-art" aria-hidden="true">{type === 'programs' ? <ProgramRunner/> : <svg viewBox="0 0 96 96" fill="none" focusable="false"><circle cx="48" cy="48" r="45" fill="#ffffff08" stroke="#ffffff18"/>{illustrations[type]}</svg>}</div></header>;
}
