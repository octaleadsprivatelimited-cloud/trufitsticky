import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Navigate, useLocation, useParams } from 'react-router-dom';
import { demoAccount, formatDate, formatMoney, invoiceFilename } from '../portal/data.mjs';
import { useAuth } from '../auth/AuthContext';
import FitnessProfile from '../portal/FitnessProfile';
import TrainingProducts from '../portal/TrainingProducts';
import Logo from '../assets/logo-original.svg';
import Wordmark from '../assets/footer-logo-text.svg';
import '../styles/customer-portal.css';
import { CompactOverview, CompactPrograms, CompactReferrals, CompactInvoices } from '../portal/CompactViews';
import '../styles/portal-compact.css';
import '../styles/portal-app.css';
import '../styles/portal-subpages.css';
import '../styles/portal-dashboard.css';

const sections = { overview: 'Overview', programs: 'My programs', profile: 'Fitness & diet', products: 'Training essentials', referrals: 'Refer a friend', invoices: 'Invoices & payments' };
const iconPaths = {
  overview: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  profile: 'M3 12h4l3-8 4 16 3-8h4',
  products: 'M6 8h12l2 13H4L6 8z M9 8V6a3 3 0 0 1 6 0v2',
  programs: 'M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5',
  referrals: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  invoices: 'M6 3h12v18l-3-2-3 2-3-2-3 2z M9 7h6 M9 11h6 M9 15h3',
  arrow: 'M5 12h14 M13 6l6 6-6 6', download: 'M12 3v12 M7 10l5 5 5-5 M4 17v4h16v-4',
  more: 'M5 11h2v2H5z M11 11h2v2h-2z M17 11h2v2h-2z',
  calendar: 'M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16 M8 14h3',
  check: 'M5 12l4 4L19 6', copy: 'M8 8h13v13H8z M16 8V3H3v13h5',
  spark: 'M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z',
};
function Icon({ name, className = '' }) { return <svg className={`portal-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[name] || iconPaths.spark}/></svg>; }
function Brand() { return <Link className="portal-brand" to="/" aria-label="Tru Fit home"><img src={Logo} alt=""/><img src={Wordmark} alt=""/></Link>; }
function useToday() {
  const [now,setNow] = useState(() => new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()),60000); return () => clearInterval(timer); },[]);
  return now;
}
function Status({ children }) { return <span className="portal-status">{children}</span>; }
function InvoiceDialog({ invoice, onClose, onDownload, busy }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} className="portal-invoice-dialog" aria-labelledby="invoice-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} data-lenis-prevent>
    <div className="portal-dialog-header"><span className="portal-kicker">Sample invoice</span><button type="button" onClick={onClose} aria-label="Close invoice">×</button></div><div className="portal-invoice-document"><div className="portal-invoice-heading"><strong>tru fit</strong><Status>Paid · demo</Status></div><h2 id="invoice-title">Your coaching.<br/>All accounted for.</h2><p>{invoice.id}</p><div className="portal-invoice-meta"><div><small>Billed to</small><strong>{demoAccount.name}</strong><span>{demoAccount.email}</span></div><div><small>Paid on</small><strong>{formatDate(invoice.paidAt)}</strong><span>{invoice.method} · {invoice.reference}</span></div></div><div className="portal-invoice-line"><span>{invoice.description}</span><strong>{formatMoney(invoice.amountMinor, invoice.currency)}</strong></div><div className="portal-invoice-total"><span>Total paid</span><strong>{formatMoney(invoice.amountMinor, invoice.currency)}</strong></div><p className="portal-fine-print">Sample document only. Not valid for payment or tax purposes.</p></div><button className="portal-button portal-dialog-download" disabled={busy === invoice.id} onClick={() => onDownload(invoice)}><Icon name="download"/>{busy === invoice.id ? 'Preparing PDF…' : 'Download sample PDF'}</button>
  </dialog>;
}
function MobileMore({ onClose, signOut }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current, previous = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} className="portal-app-sheet" aria-labelledby="portal-more-title" onCancel={onClose} data-lenis-prevent>
    <header><div><small>Your Tru Fit space</small><h2 id="portal-more-title">More for you</h2></div><button type="button" aria-label="Close more menu" onClick={onClose}>×</button></header>
    <div className="portal-app-account"><span className="portal-avatar">AM</span><div><strong>{demoAccount.name}</strong><small>Demo member account</small></div></div>
    <nav aria-label="More customer pages">{[['invoices','Invoices & payments'],['referrals','Refer a friend']].map(([key,label]) => <Link key={key} to={`/portal/${key}`} onClick={onClose}><Icon name={key}/>{label}</Link>)}<Link to="/team" onClick={onClose}>Bheemesh</Link><Link to="/" onClick={onClose}>Back to website</Link><Link to="/privacy-policy" onClick={onClose}>Privacy policy</Link><a href="mailto:support@betrufit.com">Contact support</a></nav>
    <button className="portal-app-signout" type="button" onClick={signOut}>Sign out</button>
  </dialog>;
}
export default function CustomerPortalPage() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { section = 'overview' } = useParams();
  const now = useToday();
  const [collapsed, setCollapsed] = useState(() => { try { return localStorage.getItem('trufit_compact_sidebar') === 'true'; } catch { return false; } });
  const mobileMenuRef = useRef(null);
  const [more, setMore] = useState(false);
  const [menu, setMenu] = useState(false), [invoice, setInvoice] = useState(null), [busy, setBusy] = useState(''), [notice, setNotice] = useState('');
  useEffect(() => {
    if (!menu) return;
    const outside = event => { if (!event.target.closest('.portal-navigation, .portal-mobile-menu')) setMenu(false); };
    const keyboard = event => { if (event.key === 'Escape') { setMenu(false); mobileMenuRef.current?.focus(); } };
    document.addEventListener('pointerdown',outside);
    document.addEventListener('keydown',keyboard);
    return () => { document.removeEventListener('pointerdown',outside); document.removeEventListener('keydown',keyboard); };
  },[menu]);
  function toggleSidebar() { const value = !collapsed; setCollapsed(value); try { localStorage.setItem('trufit_compact_sidebar',String(value)); } catch { /* Optional preference. */ } }
  async function download(item) {
    if (busy) return;
    setBusy(item.id); setNotice('');
    try { const { createSampleInvoice } = await import('../portal/invoice.mjs'); createSampleInvoice(item,demoAccount).save(invoiceFilename(item)); setNotice(`Sample invoice ${item.id} downloaded.`); }
    catch { setNotice('The invoice could not be downloaded. Please try again.'); }
    finally { setBusy(''); }
  }
  if (!user) return <Navigate to={`/signin?returnTo=${encodeURIComponent(location.pathname)}`} replace/>;
  const page = section === 'overview' ? <CompactOverview now={now}/> : section === 'programs' ? <CompactPrograms now={now}/> : section === 'profile' ? <FitnessProfile/> : section === 'products' ? <TrainingProducts/> : section === 'referrals' ? <CompactReferrals/> : section === 'invoices' ? <CompactInvoices onView={setInvoice} onDownload={download} busy={busy}/> : <div className="portal-card portal-small-empty"><h2>Page not found</h2><Link to="/portal">Back to overview</Link></div>;
  return <div className={`customer-portal portal-compact ${collapsed ? 'sidebar-is-compact' : ''}`} data-clarity-mask="true">
    <header className="portal-app-header"><div><Brand/><h1>{sections[section] || 'Your space'}</h1></div><button type="button" onClick={() => setMore(true)} aria-label="Open account menu" aria-haspopup="dialog"><span className="portal-avatar">AM</span></button></header>
    <aside className="portal-sidebar"><div className="portal-sidebar-top"><Brand/><button type="button" className="portal-collapse-button" onClick={toggleSidebar} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} aria-controls="portal-navigation" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg></button><button ref={mobileMenuRef} type="button" className="portal-mobile-menu" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="portal-navigation">{menu ? 'Close' : 'Menu'}</button></div><p className="portal-sidebar-label">Your Tru Fit space</p><nav id="portal-navigation" className={menu ? 'portal-navigation is-open' : 'portal-navigation'} aria-label="Customer portal">{Object.entries(sections).map(([key,label]) => <NavLink key={key} aria-label={label} title={collapsed ? label : undefined} end to={key === 'overview' ? '/portal' : `/portal/${key}`} onClick={() => setMenu(false)}><Icon name={key}/><span>{label}</span></NavLink>)}</nav><div className="portal-sidebar-bottom"><Link className="portal-back-link" to="/" title="Back to website"><Icon name="overview"/><span>Back to website</span></Link><div className="portal-sidebar-account"><span className="portal-avatar">AM</span><div><strong>{demoAccount.name}</strong><small>Demo member account</small></div></div></div></aside>
    <div className="portal-workspace"><header className="portal-topbar"><div><h1>{sections[section] || 'Your space'}</h1></div><div className="portal-topbar-right"><span className="portal-preview-pill">UI preview</span><button type="button" className="portal-signout" onClick={signOut}>Sign out</button></div></header><div className="portal-body"><div className="portal-demo-banner"><span>Sample account · changes stay in this browser tab</span></div>{notice && <div className="portal-notice" role="status">{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button></div>}<div className="portal-content" key={section} tabIndex={0} role="region" aria-label={`${sections[section] || 'Customer'} content`}>{page}</div><footer className="portal-footer"><span>Tru Fit · {now.getFullYear()}</span><span><Link to="/privacy-policy">Privacy</Link> · <a href="mailto:support@betrufit.com">Support</a> · <Link to="/team">Bheemesh</Link></span></footer></div></div>
    <nav className="portal-app-tabs" aria-label="Mobile customer navigation">{[['overview','Home'],['programs','Program'],['profile','My health'],['products','Essentials']].map(([key,label]) => <NavLink key={key} end to={key === 'overview' ? '/portal' : `/portal/${key}`}><Icon name={key}/><span>{label}</span></NavLink>)}<button type="button" className={['referrals','invoices'].includes(section) ? 'active' : ''} onClick={() => setMore(true)} aria-haspopup="dialog" aria-expanded={more}><Icon name="more"/><span>More</span></button></nav>
    {more && <MobileMore onClose={() => setMore(false)} signOut={signOut}/>}
    {invoice && <InvoiceDialog key={invoice.id} invoice={invoice} onClose={() => setInvoice(null)} onDownload={download} busy={busy}/>}
  </div>;
}
