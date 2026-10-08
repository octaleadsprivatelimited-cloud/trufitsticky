import { Link } from 'react-router-dom';
import Logo from '../assets/logo-original.svg';
import LogoText from '../assets/footer-logo-text.svg';
import { openPrivacyPreferences } from '../analytics/analytics';

export function ContactDetails(){
 return <aside className="contact-details" aria-label="Contact information and useful links">
  <Link className="brand" to="/" aria-label="Tru Fit home"><img src={Logo} alt=""/><img className="original-wordmark" src={LogoText} alt=""/></Link>
  <div className="contact-details-heading"><span className="contact-spark" aria-hidden="true">✳</span><p className="eyebrow">A human in your corner</p><h2>GOOD THINGS<br/>START WITH <em>HELLO.</em></h2><p>Real coaching. Room for real life.<br/>Let’s find what works for you.</p></div>
  <div className="contact-direct-links">
   <a href="mailto:support@betrufit.com" data-track="contact_click" data-source="email"><span className="contact-link-icon" aria-hidden="true">@</span><span><small>Email us</small>support@betrufit.com</span><span aria-hidden="true">↗</span></a>
   <a href="tel:+917207259556" data-track="contact_click" data-source="phone"><span className="contact-link-icon" aria-hidden="true">↗</span><span><small>Give us a call</small>+91 72072 59556</span><span aria-hidden="true">↗</span></a>
  </div>
  <nav className="contact-explore" aria-label="Explore Tru Fit"><h3>Find your next step</h3><div><Link to="/coaches">Our coaches ↗</Link><Link to="/plans">Coaching plans ↗</Link><Link to="/about">Our approach ↗</Link><Link to="/findmycoach">Find my coach ↗</Link><Link to="/#contact-form">Contact us ↗</Link></div></nav>
  <div className="contact-socials"><a href="https://www.instagram.com/betrufit" target="_blank" rel="noreferrer" aria-label="Tru Fit on Instagram (opens in a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/></svg><span>Instagram ↗</span></a><a href="https://www.linkedin.com/company/tru-fit" target="_blank" rel="noreferrer" aria-label="Tru Fit on LinkedIn (opens in a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10v10M5 5v.5M10 20V10h4v1.5c2-3 6-1.5 6 2V20M14 20v-6"/></svg><span>LinkedIn ↗</span></a></div>
 </aside>;
}
export function FooterBottom(){
 return <div className="contact-bottom"><span>© {new Date().getFullYear()} Tru Fit. All rights reserved.</span><nav aria-label="Legal and privacy"><Link to="/privacy-policy">Privacy</Link><Link to="/terms-conditions">Terms</Link><Link to="/refund-policy">Refunds</Link><button type="button" onClick={openPrivacyPreferences}>Cookie preferences</button></nav></div>;
}
export default function Footer(){
 return <footer className="compact-contact-footer wrap"><ContactDetails/><FooterBottom/></footer>;
}
