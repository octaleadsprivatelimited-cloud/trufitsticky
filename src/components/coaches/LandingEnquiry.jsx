import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackCoachEvent } from '../../analytics/analytics';

export default function LandingEnquiry({ coach, whatsappUrl }) {
 const [status, setStatus] = useState('idle');
 const lock = useRef(false);
 const firstName = coach.name.split(' ')[0];
 async function submit(event) {
  event.preventDefault();
  if (lock.current || status === 'success') return;
  const data = new FormData(event.currentTarget);
  lock.current = true;
  setStatus('sending');
  try {
   const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin_functions/enquiry/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: data.get('name').trim(), email: data.get('email').trim(), phone_number: data.get('phone').trim(), goal: `Coaching enquiry for ${coach.name}` }),
   });
   if (!response.ok) throw new Error('Request failed');
   trackCoachEvent('generate_lead', coach, { source: 'coach_landing', form_id: 'landing_enquiry' });
   setStatus('success');
  } catch {
   trackCoachEvent('form_error', coach, { source: 'coach_landing', form_id: 'landing_enquiry', error_type: 'network' });
   setStatus('error');
  } finally { lock.current = false; }
 }
 return <section className="landing-enquiry landing-wrap" id="landing-contact" aria-labelledby="landing-enquiry-title">
  <div><p className="eyebrow">Let’s find your starting point</p><h2 id="landing-enquiry-title">A small step.<br/><em>A fresh start.</em></h2><p>Not sure which plan fits? Leave your details and the Tru Fit team can help you explore coaching with {firstName}.</p><a className="landing-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackCoachEvent('contact_click', coach, { source: 'landing_enquiry_whatsapp' })}>Prefer WhatsApp? Talk to {firstName} ↗</a></div>
  <form onSubmit={submit} data-form-id="landing_enquiry" data-clarity-mask="true">
   <label htmlFor="landing-name">Full name<input id="landing-name" name="name" autoComplete="name" placeholder="Your name" required minLength={3} maxLength={100} disabled={status === 'success'}/></label>
   <label htmlFor="landing-phone">Phone / WhatsApp<input id="landing-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" required pattern="\+?[0-9][0-9 .\-]{8,23}" title="Enter your phone number with country code" disabled={status === 'success'}/></label>
   <label htmlFor="landing-email">Email address<input id="landing-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} disabled={status === 'success'}/></label>
   {status === 'error' && <p className="landing-form-error" role="alert">We couldn’t send your enquiry. Please try again or contact us on WhatsApp.</p>}
   {status === 'success' && <p className="landing-form-success" role="status">Thank you! Your enquiry has reached the Tru Fit team.</p>}
   <button className="button" type="submit" disabled={status === 'sending' || status === 'success'}>{status === 'sending' ? 'Sending…' : status === 'success' ? 'Enquiry sent ✓' : 'Help me choose my plan ↗'}</button>
   <p className="landing-form-note">We’ll use these details to respond to your enquiry. <Link to="/privacy-policy">Privacy policy</Link></p>
  </form>
 </section>;
}
