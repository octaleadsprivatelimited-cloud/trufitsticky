import { Link } from 'react-router-dom';
import { demoAccount, daysSince, formatDate, programProgress } from './data.mjs';
import { readDemoBooking, sessionLabel } from './booking.mjs';
import ProgramRunner from './ProgramRunner';

const icons = {
  program:'M5 4h14v17H5z M8 2v4 M16 2v4 M8 10h8 M8 14h5',
  friends:'M15 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2 M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M17 3a4 4 0 0 1 0 8 M18 15a4 4 0 0 1 3 4v1',
  invoice:'M6 3h12v18l-3-2-3 2-3-2-3 2z M9 7h6 M9 11h6 M9 15h3',
  profile:'M3 12h4l3-8 4 16 3-8h4',
  products:'M6 8h12l2 13H4L6 8z M9 8V6a3 3 0 0 1 6 0v2',
  calendar:'M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16 M8 14h3 M8 17h6',
  check:'m5 12 4 4L19 6',
};
function DashboardIcon({ name }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icons[name] || icons.program}/></svg>; }

export default function DashboardOverview({ now }) {
  const account = demoAccount, program = account.programs.find(item => item.status === 'active');
  const progress = programProgress(program,now,account.timezone), booking = readDemoBooking(), slot = sessionLabel(booking?.slot);
  const metrics = [
    { icon:'program',value:progress.elapsed,label:'Program day',detail:`of ${progress.total} days`,to:'/portal/programs' },
    { icon:'friends',value:account.referrals.entries.filter(item => item.status === 'joined').length,label:'Friends joined',detail:'Your referral activity',to:'/portal/referrals' },
    { icon:'invoice',value:account.invoices.length,label:'Paid invoices',detail:'View your payments',to:'/portal/invoices' },
  ];
  return <div className="portal-view portal-overview dashboard-refined">
    <section className="portal-member-hero" aria-labelledby="portal-hero-title">
      <div className="portal-hero-copy"><p className="portal-hero-eyebrow">Your Tru Fit journey</p><h2 id="portal-hero-title">Hi, {account.name.split(' ')[0]}.</h2><p>A little better. Every day.</p><span className="dashboard-member-since">Member since {formatDate(account.joinedAt)}</span></div>
      <div className="portal-hero-days"><DashboardIcon name="calendar"/><strong>{daysSince(account.joinedAt,now,account.timezone)}</strong><span>days with Tru Fit</span></div>
    </section>
    <div className="dashboard-metrics">{metrics.map(metric => <Link to={metric.to} key={metric.label} className="dashboard-metric"><span className="dashboard-metric-icon"><DashboardIcon name={metric.icon}/></span><div><span className="dashboard-metric-label">{metric.label}</span><div className="dashboard-metric-value"><strong>{metric.value}</strong><small>{metric.detail}</small></div></div></Link>)}</div>
    <div className="compact-overview-grid">
      <section className="portal-card compact-program-card">
        <div className="portal-card-heading"><h3>Your program</h3><Link to="/portal/programs">View details</Link></div>
        <div className="portal-program-scene"><div className="compact-program-name"><span className="dashboard-program-label">{program.durationWeeks}-week program</span><strong>{program.name}</strong><Link className="dashboard-coach" to={`/coaches/${program.coachSlug}`}><span className="dashboard-coach-avatar">{program.coach.split(' ').map(part => part[0]).join('')}</span><span><small>Your coach</small>{program.coach}</span></Link></div><ProgramRunner/></div>
        <ul className="dashboard-program-includes">{program.focus.map(item => <li key={item}><DashboardIcon name="check"/>{item}</li>)}</ul>
        <div className="portal-program-progress"><div className="compact-progress"><span>Day {progress.elapsed} <span className="dashboard-progress-total">of {progress.total}</span></span><strong>{progress.percent}%</strong></div><progress max="100" value={progress.percent} aria-label="Program calendar progress"/><div className="dashboard-program-dates"><span>{formatDate(program.startDate)} – {formatDate(program.endDate)}</span><strong>{progress.remaining} days left</strong></div></div>
      </section>
      <section className={`portal-card dashboard-session-card ${booking ? 'has-booking' : ''}`}>
        <div className="portal-card-heading"><h3>Next session</h3><span className="portal-status">{booking ? 'Demo booking' : 'Not scheduled'}</span></div>
        <div className="dashboard-session-content"><span className="dashboard-session-art"><DashboardIcon name="calendar"/></span><div className="dashboard-session-copy">{booking ? <><strong>{booking.coachName}</strong><span className="dashboard-session-desktop-date">{slot.date}</span><span className="dashboard-session-mobile-date">{formatDate(booking.slot.date)}</span><span>{slot.time} · IST</span></> : <><strong>Your next step starts here.</strong><p>Choose your coach and find a time that works for you.</p></>}</div><Link className="portal-button dashboard-session-button" to={booking ? `/coaches/${booking.coachSlug}` : '/coaches'}>{booking ? 'View your coach' : 'Find your coach'}</Link></div>
        <div className="dashboard-session-support"><span>Need a hand with your plan?</span><a href="mailto:support@betrufit.com">Contact Tru Fit</a></div>
      </section>
    </div>
    <nav className="compact-shortcuts" aria-label="Dashboard quick links">{[['profile','profile','Fitness & diet','Your personal profile'],['products','products','Training essentials','Picks from your team'],['invoices','invoice','Invoices','View and download'],['referrals','friends','Refer a friend','Grow your circle']].map(([path,icon,title,note]) => <Link to={`/portal/${path}`} key={path}><span className="dashboard-shortcut-icon"><DashboardIcon name={icon}/></span><div><strong>{title}</strong><span>{note}</span></div></Link>)}</nav>
  </div>;
}
