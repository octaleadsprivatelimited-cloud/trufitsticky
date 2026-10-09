import WhatsAppMark from './WhatsAppMark';
import { trackCoachEvent } from '../../analytics/analytics';

export function LandingSalesPitch({ coach, content }) {
 const firstName = coach.name.split(' ')[0];
 return <section className="landing-pitch landing-wrap" aria-labelledby="landing-pitch-title">
  <div className="landing-pitch-copy"><p className="eyebrow">Make your next start count</p><h2 id="landing-pitch-title">{content.pitchTitle}</h2><p>{content.pitch}</p><a className="button" href="#landing-plans" onClick={() => trackCoachEvent('cta_click', coach, {source:'landing_pitch'})}>Build my routine ↗</a><span className="landing-pitch-note">Explore the full price and support before you book.</span></div>
  <div className="landing-shift"><div className="landing-shift-head"><span>Sound familiar?</span><span>Your next approach</span></div>{content.shifts.map(([friction, support]) => <div className="landing-shift-row" key={friction}><p>{friction}</p><span aria-hidden="true">→</span><p>{support}</p></div>)}<p className="landing-shift-foot">You bring the effort. {firstName} helps you give it direction.</p></div>
 </section>;
}

export function LandingSalesDecision({ coach, whatsappUrl, onContact }) {
 const firstName = coach.name.split(' ')[0];
 return <section className="landing-decision landing-wrap" aria-labelledby="landing-decision-title">
  <div className="landing-section-heading"><div><p className="eyebrow">You don’t need a perfect starting point</p><h2 id="landing-decision-title">Ready for support.<br/><em>Still have questions?</em></h2></div><p className="landing-decision-intro">Choose the next step that feels right. Understand the commitment before you make it.</p></div>
  <div className="landing-objection-grid">
   <details><summary><span aria-hidden="true">◷</span> “My schedule is already full.” <span aria-hidden="true">+</span></summary><p>Start with the time you actually have. Tell {firstName} about your work, travel, and equipment so your training can be built around your routine.</p></details>
   <details><summary><span aria-hidden="true">↺</span> “I’ve tried before.” <span aria-hidden="true">+</span></summary><p>You don’t have to repeat the same approach. Work with your coach on manageable habits, review what gets in the way, and adjust as you go.</p></details>
   <details><summary><span aria-hidden="true">?</span> “What if this isn’t right for me?” <span aria-hidden="true">+</span></summary><p>Ask about the approach on WhatsApp, or choose a paid consultation where available. Explore expectations and fit before choosing a full program.</p></details>
  </div>
  <div className="landing-fit"><div><strong>This could be your kind of coaching.</strong><p>You’re willing to practice, share honest updates, and build habits over time. Your coach brings structure and feedback; progress still takes your participation.</p></div><a href={whatsappUrl} className="landing-whatsapp" target="_blank" rel="noreferrer" onClick={onContact}><WhatsAppMark/>Chat on WhatsApp</a></div>
 </section>;
}
