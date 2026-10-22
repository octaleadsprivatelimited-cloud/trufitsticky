import { useState } from 'react';
import CoachPortrait from './CoachPortrait';
import CoachReviews from './CoachReviews';
import { reviewSummary } from './reviewData.mjs';
import TruFitSymbol from '../../assets/logo-original.svg';
import WhatsAppMark from './WhatsAppMark';
import { scrollToSection } from '../../scroll/smoothScroll';
import { trackCoachEvent } from '../../analytics/analytics';
import './coachProfileOverview.css';

const levelLabel = coach => String(coach.coach_level_name || coach.coach_level || 'Coach').toLowerCase().replace(/^./, value => value.toUpperCase());

export default function CoachProfileOverview({ coach, testimonials = [], certifications = [], bookingOpen = false, children }) {
 const [aboutOpen, setAboutOpen] = useState(false);
 const firstName = coach.name.split(' ')[0];
 const summary = reviewSummary(testimonials, coach.id);
 const specialties = String(coach.specializations || '').split(/[,;\n]/).map(value => value.trim()).filter(Boolean);
 const experience = Number(coach.experience);
 const number = String(coach.whatsapp_number || '917207259556').replace(/\D/g, '');
 const whatsapp = `https://wa.me/${number}?text=${encodeURIComponent(`Hi ${firstName}, I’d like to know more about your Tru Fit coaching plans.`)}`;
 function jump(event, id) {
  event.preventDefault();
  if (id === 'coach-about') setAboutOpen(true);
  requestAnimationFrame(() => {
   const target = document.getElementById(id);
   target?.focus({ preventScroll:true });
   scrollToSection(target);
  });
 }
 return <>
  <header className="profile-banner coaching-offer" id="coach-overview" tabIndex={-1}>
   <img className="profile-brand-mark" src={TruFitSymbol} alt="" aria-hidden="true"/>
   <div className="coaching-coach-card"><div className="profile-identity"><div className="profile-avatar"><CoachPortrait coach={coach} enablePreview={false}/></div><div><p className="profile-kicker">Your {levelLabel(coach).toLowerCase()} coach</p><h2>{coach.name}</h2>{coach.location && <p className="profile-location">{coach.location}</p>}{summary.average && <a className="coaching-rating-link" href="#coach-reviews" onClick={event => jump(event,'coach-reviews')}>★ {summary.average}/5 · {summary.rated.length} {summary.coachSpecific ? 'coach ratings' : 'Tru Fit ratings'}</a>}</div></div>{specialties.length > 0 && <div className="coaching-specialties"><span>Specialties</span><p>{specialties.slice(0,3).join(' · ')}</p></div>}</div>
   <div className="coaching-offer-copy"><p className="coaching-offer-kicker">Personal fitness & nutrition coaching</p><h1>Your goal.<br/><span>A plan to get there.</span></h1><p className="coaching-offer-description">Workouts, nutrition and a real coach in your corner.</p><ul className="coaching-offer-benefits"><li>Made for your routine</li><li>Regular check-ins</li><li>Individual guidance</li></ul></div>
  </header>
  <nav className="profile-tabs coaching-page-nav" aria-label="On this coach page"><a id="profile-tab-plans" href="#cpx-plans" onClick={event => jump(event,'cpx-plans')}>Plans & pricing</a><a href="#coach-reviews" onClick={event => jump(event,'coach-reviews')}>Reviews{summary.reviews.length > 0 && ` (${summary.reviews.length})`}</a><a className="coaching-mobile-link" href="#coach-inclusions" onClick={event => jump(event,'coach-inclusions')}>What’s included</a><a className="coaching-mobile-link" href="#coach-faq" onClick={event => jump(event,'coach-faq')}>FAQs</a><a href="#coach-about" onClick={event => jump(event,'coach-about')}>About {firstName}</a></nav>
  <div className={`coaching-booking-layout${bookingOpen ? ' is-booking' : ''}`}><div className="coaching-stack-anchor" data-stack-for="cpx-plans" aria-hidden="true"/><div className="coaching-plan-panel">{children}</div><div className="coaching-stack-anchor" data-stack-for="coach-reviews" aria-hidden="true"/><CoachReviews summary={summary} coachName={coach.name}/>{!bookingOpen && <><div className="coaching-stack-anchor" data-stack-for="coach-inclusions" aria-hidden="true"/><aside id="coach-inclusions" className="coaching-guide" tabIndex={-1} aria-label="What your coaching includes"><div><p className="coaching-eyebrow">More than a workout plan</p><h2>Your coach. Your complete plan.</h2><ul className="coaching-inclusions"><li><span aria-hidden="true">✓</span><div><strong>Training built around you</strong><p>Workouts shaped around your goal, routine and experience.</p></div></li><li><span aria-hidden="true">✓</span><div><strong>Nutrition that fits real life</strong><p>Personal guidance for your food preferences and daily habits.</p></div></li><li><span aria-hidden="true">✓</span><div><strong>Support as you progress</strong><p>Coach check-ins and adjustments as your needs change.</p></div></li></ul></div><div className="coaching-start-steps"><h3>Getting started is simple</h3><ol><li><span>1</span><div><strong>Choose your plan</strong><p>Individual or couple. Pick your duration.</p></div></li><li><span>2</span><div><strong>Add your details</strong><p>Sign in and complete one short form.</p></div></li><li><span>3</span><div><strong>Pay & get started</strong><p>Review the total and continue to payment.</p></div></li></ol></div><a className="coaching-question" href={whatsapp} target="_blank" rel="noreferrer" onClick={()=>trackCoachEvent('contact_click',coach,{source:'profile_booking_question'})}><WhatsAppMark/>Have a question? Chat with {firstName}</a></aside></>}</div>
  <details className="coaching-about" id="coach-about" open={aboutOpen} onToggle={event => setAboutOpen(event.currentTarget.open)} tabIndex={-1}><summary><div><span className="coaching-eyebrow">Get to know your coach</span><h2>About {firstName} & the story behind the coach</h2></div><span className="coaching-about-toggle" aria-hidden="true">+</span></summary><div className="profile-information"><section className="profile-content-panel"><h3>Meet {coach.name}</h3>{coach.summary && <p>{coach.summary}</p>}{coach.bio && coach.bio!==coach.summary && <p>{coach.bio}</p>}{coach.previous_work && coach.previous_work!==coach.summary && coach.previous_work!==coach.bio && <p>{coach.previous_work}</p>}{!coach.summary && !coach.bio && !coach.previous_work && <p>Chat with {firstName} to discuss your goals and routine.</p>}<a className="text-link" href="#cpx-plans" onClick={event => jump(event,'cpx-plans')}>View plans & pricing</a></section><aside className="profile-facts"><section className="profile-fact-card"><h3>Experience & specialties</h3>{experience > 0 && <p>{experience} {experience === 1 ? 'year' : 'years'} of coaching</p>}<ul className="profile-specialty-list">{specialties.map(value => <li key={value}>{value}</li>)}</ul></section>{certifications.length > 0 && <section className="profile-fact-card"><h3>Qualifications</h3><ul className="profile-qualifications">{certifications.map(value => <li key={value}>{value}</li>)}</ul></section>}{(coach.insta_link || coach.linkedin_link) && <div className="profile-social-links">{coach.insta_link && <a href={coach.insta_link} target="_blank" rel="noreferrer">Instagram</a>}{coach.linkedin_link && <a href={coach.linkedin_link} target="_blank" rel="noreferrer">LinkedIn</a>}</div>}</aside></div></details>
 </>;
}
