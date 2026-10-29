import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Logo from '../assets/logo-original.svg';
import LogoText from '../assets/footer-logo-text.svg';
import './navBar.css';
export default function NavBar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const { pathname } = useLocation();
  const expanded = open === pathname;
  useEffect(() => {
    let wasCompact = false;
    const updateHeader = () => {
      // Separate thresholds avoid flicker when the header changes height.
      const next = window.scrollY > (wasCompact ? 32 : 96);
      if (next !== wasCompact) {
        wasCompact = next;
        setCompact(next);
      }
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);
  return <header className={`site-header${compact ? ' is-compact' : ''}`}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="site-nav wrap">
      <Link className="brand" to="/" aria-label="Tru Fit home"><img src={Logo} alt=""/><img className="original-wordmark" src={LogoText} alt=""/></Link>
      <button className="menu-button" aria-expanded={expanded} aria-controls="site-links" onClick={() => setOpen(expanded ? false : pathname)}>{expanded ? 'Close' : 'Menu'}</button>
      <nav id="site-links" className={expanded ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
        <NavLink to="/coaches">Our coaches</NavLink><NavLink to="/bmi-calculator">BMI calculator</NavLink><NavLink to="/calorie-calculator">Calorie calculator</NavLink>
        <NavLink to={user ? "/portal" : "/signin"} className="customer-portal-link">{user ? "My account" : "Sign in / Sign up"}</NavLink>
      </nav>
    </div>
  </header>;
}
