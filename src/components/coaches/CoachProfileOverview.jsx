import { useRef, useState } from 'react';
import CoachPortrait from './CoachPortrait';
import WhatsAppMark from './WhatsAppMark';
import { trackCoachEvent } from '../../analytics/analytics';
import './coachProfileOverview.css';

export default function CoachProfileOverview({ coach, testimonials = [], certifications = [] }) {
 const [active, setActive] = useState('about');
 const tabs = useRef([]);
 const firstName = coach.name.split(' ')[0];
 const reviews = testimonials.filter(review => review.body && review.client_name && String(review.coach_id ?? review.coach?.id ?? review.coach) === String(coach.id));
 const rated = reviews.filter(review => Number(review.rating) >= 1 && Number(review.rating) <= 5);
 const average = rated.length ? (rated.reduce((sum, review) => sum + Number(review.rating), 0) / rated.length).toFixed(1) : null;
 const specialties = String(coach.specializations || '').split(/[,;\n]/).map(value => value.trim()).filter(Boolean);
 const experience = Number(coach.experience);
 const number = String(coach.whatsapp_number || '917207259556').replace(/\D/g, '');
 const whatsapp = `https://wa.me/${number}?text=${encodeURIComponent(`Hi ${firstName}, I’d like to know more about your Tru Fit coaching plans.`)}`;
 const changeTab = value => setActive(value);
 const tabKeys = (event, index) => {
  let next;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - index;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = 1;
  else return;
  event.preventDefault(); setActive(next === 0 ? 'reviews' : 'about'); tabs.current[next]?.focus();
 };
 return <>
  <header className="profile-banner" id="coach-overview" tabIndex={-1}>
   <div className="profile-identity"><div className="profile-avatar"><CoachPortrait coach={coach}/><span>{coach.coach_level_name || coach.coach_level || 'Coach'}</span></div><div><p className="profile-kicker">Your Tru Fit coach</p><h1>{coach.name}</h1>{coach.location && <p className="profile-location">{coach.location}</p>}</div></div>
   <div className="profile-banner-actions"><a className="button" href="#cpx-plans" onClick={()=>trackCoachEvent('cta_click',coach,{source:'profile_banner_plans'})}>See plans ↗</a><a className="profile-whatsapp" href={whatsapp} target="_blank" rel="noreferrer" onClick={()=>trackCoachEvent('contact_click',coach,{source:'profile_banner_whatsapp'})}><WhatsAppMark/>Chat with coach</a></div>
  </header>
  <div className="profile-information">
   <aside className="profile-facts" aria-label="Coach details">
    <section className="profile-fact-card"><h2>Coaching experience</h2><div className="profile-metrics"><div><strong>{experience > 0 ? experience : coach.coach_level_name || 'Personal'}</strong><span>{experience > 0 ? `${experience === 1 ? 'year' : 'years'} coaching` : 'Coaching level'}</span></div><div><strong>{average ? `${average}/5` : '—'}</strong><span>{average ? `${rated.length} published reviews` : 'No rated reviews yet'}</span></div></div></section>
    {specialties.length > 0 && <section className="profile-fact-card"><h2>Specialties</h2><ul className="profile-specialty-list">{specialties.map(value=><li key={value}>{value}</li>)}</ul></section>}
    {certifications.length > 0 && <section className="profile-fact-card"><h2>Qualifications</h2><ul className="profile-qualifications">{certifications.map(value=><li key={value}>{value}</li>)}</ul></section>}
    {(coach.insta_link || coach.linkedin_link) && <div className="profile-social-links">{coach.insta_link && <a href={coach.insta_link} target="_blank" rel="noreferrer">Instagram ↗</a>}{coach.linkedin_link && <a href={coach.linkedin_link} target="_blank" rel="noreferrer">LinkedIn ↗</a>}</div>}
   </aside>
   <section className="profile-tab-content" id="coach-about" tabIndex={-1}>
    <div className="profile-tabs" role="tablist" aria-label="About this coach">{[['reviews','Reviews'],['about','About me']].map(([value,label],index)=><button key={value} ref={node=>{tabs.current[index]=node}} role="tab" id={`profile-tab-${value}`} aria-selected={active===value} aria-controls={`profile-panel-${value}`} tabIndex={active===value?0:-1} onClick={()=>changeTab(value)} onKeyDown={event=>tabKeys(event,index)}>{label}{value==='reviews' && reviews.length>0 ? ` (${reviews.length})` : ''}</button>)}</div>
    <div role="tabpanel" id="profile-panel-about" aria-labelledby="profile-tab-about" hidden={active!=='about'} tabIndex={0} className="profile-content-panel"><h2>Meet {firstName}</h2>{coach.summary && <p>{coach.summary}</p>}{coach.bio && coach.bio!==coach.summary && <p>{coach.bio}</p>}{coach.previous_work && coach.previous_work!==coach.summary && coach.previous_work!==coach.bio && <p>{coach.previous_work}</p>}{!coach.summary && !coach.bio && !coach.previous_work && <p>Explore {firstName}’s coaching plans or chat to discuss your goals and routine.</p>}<div className="profile-about-next"><strong>Find the right program for you.</strong><p>Compare durations, inclusions, and total prices before you enrol.</p><a className="text-link" href="#cpx-plans">Explore plans ↗</a></div></div>
    <div role="tabpanel" id="profile-panel-reviews" aria-labelledby="profile-tab-reviews" hidden={active!=='reviews'} tabIndex={0} className="profile-content-panel">
     {average && <div className="profile-rating-summary"><div><span>Average rating</span><strong>{average}<small>/5</small></strong><span className="profile-rating-stars" aria-hidden="true">{'★'.repeat(Math.round(Number(average)))}</span><span>{rated.length} published reviews</span></div><div className="profile-rating-bars">{[5,4,3,2,1].map(star=>{const count=rated.filter(review=>Math.round(Number(review.rating))===star).length;return <div key={star}><span>{star} star</span><progress value={count} max={rated.length} aria-label={`${star} star: ${count} reviews`}/><span>{count}</span></div>})}</div></div>}
     {reviews.length ? <div className="profile-review-list">{reviews.map((review,index)=><article key={review.id||index}><header>{review.image_url?<img src={review.image_url} alt="" loading="lazy"/>:<span className="profile-review-initial" aria-hidden="true">{review.client_name.charAt(0)}</span>}<div><strong>{review.client_name}</strong>{Number(review.rating)>=1&&Number(review.rating)<=5&&<span className="profile-rating-stars" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(Math.round(Number(review.rating)))}</span>}</div></header><p>{review.body}</p></article>)}</div>:<div className="profile-no-reviews"><h2>Reviews are not published yet.</h2><p>Chat with {firstName} to understand the coaching approach and what to expect before choosing a program.</p><a className="text-link" href={whatsapp} target="_blank" rel="noreferrer" onClick={()=>trackCoachEvent('contact_click',coach,{source:'profile_reviews'})}>Ask your coach ↗</a></div>}
    </div>
   </section>
  </div>
 </>;
}
