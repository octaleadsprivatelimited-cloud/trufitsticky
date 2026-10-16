import { Link } from 'react-router-dom';
import { sessionLabel } from '../portal/booking.mjs';
import { demoAccount } from '../portal/data.mjs';
import '../styles/member-access.css';

export default function BookingWelcome({ booking, compact = false }) {
  const session = sessionLabel(booking.slot);
  return <section className={`member-booking-welcome ${compact ? 'is-compact' : ''}`} data-clarity-mask="true">
    <span className="member-access-badge">Booking confirmation preview · no payment taken</span>
    {!compact && <><span className="member-welcome-check" aria-hidden="true">✓</span><h1>Welcome to Tru Fit, {booking.name?.split(' ')[0] || demoAccount.name.split(' ')[0]}.</h1><p>Your journey with {booking.coachName.split(' ')[0]} starts here. This is how your welcome will look after a confirmed payment.</p></>}
    {compact && <h2>Your upcoming welcome call</h2>}
    <div className="member-booking-card"><div className="member-booked-coach">{booking.coachImage ? <img src={booking.coachImage} alt=""/> : <span className="member-coach-initial" aria-hidden="true">{booking.coachName.split(' ').map(name => name[0]).slice(0, 2).join('')}</span>}<div><small>Your coach</small><h2>{booking.coachName}</h2><p>{booking.planName}</p></div></div><dl><div><dt>Session date</dt><dd>{session?.date || 'To be arranged'}</dd></div><div><dt>Time slot</dt><dd>{session?.time || 'To be arranged'}<small>{session?.timezone}</small></dd></div><div><dt>Session</dt><dd>20-minute welcome call · Online</dd></div><div><dt>Booking reference</dt><dd>{booking.reference}</dd></div></dl></div>
    {!compact && <><p className="member-welcome-note">Your coach and session details are also available in your customer panel. No email or calendar invitation is sent in this preview.</p><div className="member-welcome-actions"><Link className="member-primary" to="/portal">Open my customer panel</Link><Link className="member-text-button" to={`/coaches/${booking.coachSlug}`}>View my coach</Link></div></>}
  </section>;
}
