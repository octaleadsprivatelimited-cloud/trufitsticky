import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import CoachPortrait from './CoachPortrait';
import { articles } from '../../content/blog.mjs';

const advantages = [
 ['training', 'Training built around you', 'Workouts shaped around your goal, routine and experience.'],
 ['nutrition', 'Nutrition that fits real life', 'Personal guidance for your food preferences and daily habits.'],
 ['support', 'Support as you progress', 'Coach check-ins and adjustments as your needs change.'],
 ['routine', 'Made for your routine', 'Individual guidance. Regular check-ins. A plan that adapts.'],
];
const benefits = {
 Training: [['Your goal', 'Training built around you'], ['Your routine', 'Workouts shaped around your goal, routine and experience.'], ['Your experience', 'Individual guidance']],
 Nutrition: [['Your preferences', 'Nutrition that fits real life'], ['Your daily habits', 'Personal guidance for your food preferences and daily habits.'], ['Your plan', 'Personal nutrition guidance']],
 Support: [['Regular check-ins', 'Support as you progress'], ['Thoughtful adjustments', 'Coach check-ins and adjustments as your needs change.'], ['Your coach', 'A real coach in your corner.']],
};
function moveTab(event) {
 if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
 const tabs = [...event.currentTarget.querySelectorAll('[role="tab"]')];
 const current = tabs.indexOf(event.target);
 if (current < 0) return;
 event.preventDefault();
 const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
 tabs[next].focus();
 tabs[next].click();
}
function Icon({ type }) {
 return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === 'training' ? <><path d="M4 12v8m5-12v16m14-16v16m5-12v8M9 16h14"/></> : type === 'nutrition' ? <><path d="M17 9c-10-7-15 7-8 16 3 4 5 1 8 1s5 3 8-1c6-9 2-20-8-16Z"/><path d="M17 9c0-5 3-7 6-7-1 5-3 7-6 7Z"/></> : type === 'support' ? <><path d="M6 23 2 28v-9C-1 4 25-2 29 12c4 12-12 18-23 11Z"/><path d="m10 15 4 4 8-9"/></> : <><rect x="5" y="7" width="22" height="22" rx="4"/><path d="M10 3v8m12-8v8M5 15h22m-16 6 3 3 7-6"/></>}</svg>;
}
export function CoachDemoSections({ coach }) {
 const [active, setActive] = useState('Training');
 const id = useId();
 return <div className="reserve-demo-sections">
  <section id="demo-coach-benefits" tabIndex={-1} className="reserve-advantages" aria-labelledby={`${id}-advantages`}>
   <p className="reserve-kicker">More than a workout plan</p><h2 id={`${id}-advantages`}>Your coach. Your complete plan.</h2>
   <div className="reserve-advantage-grid">{advantages.map(([type,title,body])=><article className="reserve-advantage-card" key={type}><Icon type={type}/><h3>{title}</h3><p>{body}</p></article>)}</div>
  </section>
  <section className="reserve-benefit-panel" aria-labelledby={`${id}-benefits`}>
   <p className="reserve-kicker">Personal fitness & nutrition coaching</p><h2 id={`${id}-benefits`}>Individual guidance. Everyday support.</h2>
   <div className="reserve-pill-tabs" role="tablist" onKeyDown={moveTab} aria-label="Coaching benefits">{Object.keys(benefits).map((label,index)=><button key={label} role="tab" type="button" id={`${id}-tab-${index}`} tabIndex={active===label?0:-1} aria-selected={active===label} aria-controls={`${id}-panel`} onClick={()=>setActive(label)}>{label}</button>)}</div>
   <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${Object.keys(benefits).indexOf(active)}`} className="reserve-benefit-grid">{benefits[active].map(([title,body],index)=><article className="reserve-benefit-card" key={`${active}-${title}`}><span className="reserve-benefit-number" aria-hidden="true">0{index+1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
  </section>
  <section className="reserve-story-split" aria-labelledby={`${id}-steps`}>
   <div className="reserve-story-copy"><p className="reserve-kicker">Your next step. Made simple.</p><h2 id={`${id}-steps`}>Getting started is simple</h2><div className="reserve-step-list">{[['Choose your plan','Individual or couple. Pick your duration.'],['Add your details','Sign in and complete one short form.'],['Pay & get started','Review the total and continue to payment.']].map(([title,body],index)=><div key={title}><span>{index+1}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}</div><a href="#cpx-plans" className="reserve-text-link">Plans & pricing</a></div>
   <div className="reserve-story-portrait"><CoachPortrait coach={coach} enablePreview={false}/><div><span>Your coach</span><strong>{coach.name}</strong><p>Workouts, nutrition and a real coach in your corner.</p></div></div>
  </section>
 </div>;
}
export function CoachDemoOnboarding() {
 const [active, setActive] = useState('Before you begin');
 const id = useId();
 return <aside className="reserve-onboarding" aria-labelledby={`${id}-title`}><p className="reserve-kicker">Your next chapter starts here</p><h2 id={`${id}-title`}>Your next step.</h2><div className="reserve-pill-tabs" role="tablist" onKeyDown={moveTab} aria-label="Getting started information">{['Before you begin','Your first session'].map((title,index)=><button type="button" role="tab" tabIndex={active===title?0:-1} aria-selected={active===title} aria-controls={`${id}-panel`} id={`${id}-tab-${index}`} key={title} onClick={()=>setActive(title)}>{title}</button>)}</div><div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active==='Before you begin'?0:1}`} className="reserve-onboarding-content">{active==='Before you begin'?<><Icon type="routine"/><h3>Choose your plan</h3><p>Individual or couple. Pick your duration.</p><ul><li>Sign in and complete one short form.</li><li>Review the total and continue to payment.</li><li>One payment. No automatic renewal.</li></ul></>:<><Icon type="support"/><h3>Start with your routine</h3><p>Personal guidance for your food preferences and daily habits.</p><ul><li>Workouts shaped around your goal, routine and experience.</li><li>Coach check-ins and adjustments as your needs change.</li></ul></>}<p className="reserve-preview-note">UI preview. No payment or request is submitted.</p></div></aside>;
}
export function CoachDemoReads() {
 const [topic, setTopic] = useState('Getting started');
 const id = useId();
 const article = articles.find(item=>item.category===topic) || articles[0];
 return <aside className="reserve-reads" aria-labelledby={`${id}-title`}><h2 id={`${id}-title`}>Helpful reads</h2><div className="reserve-pill-tabs" role="tablist" onKeyDown={moveTab} aria-label="Guide topics">{['Getting started','Training'].map((label,index)=><button role="tab" type="button" key={label} id={`${id}-tab-${index}`} tabIndex={topic===label?0:-1} aria-selected={topic===label} aria-controls={`${id}-panel`} onClick={()=>setTopic(label)}>{label}</button>)}</div><div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${topic==='Training'?1:0}`}><div className="reserve-read-visual" aria-hidden="true"><Icon type={topic==='Training'?'training':'routine'}/></div><p className="reserve-kicker">{article.category}</p><h3>{article.title}</h3><p>{article.excerpt}</p><Link to={`/blog/${article.slug}`} className="reserve-text-link">Read guide</Link></div></aside>;
}
