import { Link } from 'react-router-dom';
import FeaturedCoaching from '../components/FeaturedCoaching';
import ProgressShowcase from '../components/home/ProgressShowcase';
const faq = [
 ['Do I need to be fit to get started?', 'Not at all. Your coach starts with your current routine and builds a plan around your experience, preferences, and goals.'],
 ['What does online coaching include?', 'Personalized workouts, nutrition guidance, regular check-ins, and ongoing support from your coach. See each coach’s plan for the full inclusions.'],
 ['Can we sign up together?', 'Couple coaching is built for two people with one coach and a common start date. Each person gets individual training and nutrition guidance. Available packages and prices appear on your coach’s profile.'],
 ['Can my plan fit around work and travel?', 'Yes. Your coach helps adjust your routine when your schedule changes, so you can stay consistent without needing a perfect week.'],
 ['How do I choose a coach?', 'Explore coach profiles to understand their experience and approach, or take our short questionnaire to find a match. You can start with a consultation before choosing a coaching program.']
];
export default function HomePage() {
 return <>
 <section id="home-overview" tabIndex={-1} className="culture-hero wrap" aria-labelledby="home-title">
  <div className="culture-title-row"><h1 id="home-title">Personal coaching.<br/><span>Built around <em>you.</em></span></h1><div className="hero-sticker"><span aria-hidden="true">✳</span><p>Your pace.<br/>Your people.<br/><strong>Your progress.</strong></p></div></div>
  <div className="culture-hero-bottom"><p>A coach who gets you. A plan that fits.<br/>Make room for a healthier everyday.</p><div className="button-row"><Link className="button" to="/coaches" data-track="cta_click" data-source="home_hero">Meet your coach <span aria-hidden="true">↗</span></Link><Link className="text-link" to="/plans">Explore plans <span aria-hidden="true">→</span></Link></div></div>
  <ProgressShowcase/>

 </section>
 <section className="section wrap" id="the-trufit-way" tabIndex={-1}><div className="section-heading" data-reveal><div><p className="eyebrow">01 / The Tru Fit way</p><h2>LESS GUESSWORK.<br/>MORE <em>GOING FORWARD.</em></h2></div><p>You don’t need another rigid routine. You need a coach who listens, a clear next step, and support that stays with you.</p></div><div className="feature-grid">{[
 ['01','A coach who gets you','Someone who understands your starting point, listens to your goals, and keeps you accountable without the pressure.','↗'],
 ['02','A plan that adapts','Workouts and nutrition shaped around your schedule, preferences, and the equipment you actually have.','✳'],
 ['03','Support that sticks','Regular check-ins, useful feedback, and thoughtful adjustments as your confidence and consistency grow.','↔']
 ].map(([n,t,c,icon]) => <article className="feature-card" key={n} data-reveal><div className="feature-top"><span className="number">{n}</span><span className="feature-icon" aria-hidden="true">{icon}</span></div><h3>{t}</h3><p>{c}</p></article>)}</div></section>
 <section id="home-programs" tabIndex={-1} className="together-section wrap" data-reveal><div className="together-title"><p className="eyebrow">02 / Make it your own</p><h2>YOUR JOURNEY.<br/>SOLO OR <em>TOGETHER.</em></h2><p>Different goals. The same commitment.<br/>Find the support that makes sense for you.</p></div><div className="journey-cards"><Link to="/coaches" className="journey-card" data-track="cta_click" data-source="home_individual"><span className="journey-icon" aria-hidden="true">01</span><div><h3>Individual coaching</h3><p>One person. One coach. A routine built around your life.</p></div><span className="journey-link">Find my coach ↗</span></Link><Link to="/coaches" className="journey-card journey-couple" state={{coupleMode:true}} data-track="cta_click" data-source="home_couple"><span className="journey-icon" aria-hidden="true">02</span><div><h3>Couple coaching</h3><p>Two people. Individual plans. A shared starting point.</p></div><span className="journey-link">Explore our coaches ↗</span></Link></div></section>
 <FeaturedCoaching/>

 <section id="home-start" tabIndex={-1} className="section wrap"><div className="section-heading" data-reveal><div><p className="eyebrow">04 / Getting started</p><h2>YOUR NEXT STEP.<br/>MADE <em>SIMPLE.</em></h2></div><Link className="button button-outline" to="/findmycoach" data-track="cta_click" data-source="home_steps">Find my coach ↗</Link></div><div className="steps-grid">{[['1','Find your person','Explore coaches or take the short matching quiz.'],['2','Make a plan','Choose an individual or couple program, or start with a consultation.'],['3','Build your rhythm','Train, check in, and adjust with your coach as you go.']].map(([n,t,c]) => <div key={n} data-reveal><span className="step-number">{n}</span><h3>{t}</h3><p>{c}</p></div>)}</div></section>
 <section className="faq-section wrap" id="faq" tabIndex={-1} data-reveal><div><p className="eyebrow">05 / A few things to know</p><h2>GOOD QUESTIONS.<br/>STRAIGHT <em>ANSWERS.</em></h2><p>Still wondering? <a className="text-link" href="#contact-form">Let’s talk →</a></p></div><div className="faq-list">{faq.map(([q,a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>

 </>;
}
