import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Logo from '../assets/logo-original.svg';
import LogoText from '../assets/footer-logo-text.svg';
import './navBar.css';
export default function NavBar() {
  const { user } = useAuth();
  const [compact, setCompact] = useState(false);
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
      <nav id="site-links" className="nav-links" aria-label="Main navigation">
        <NavLink to="/coaches" className="coaching-link">Coaching</NavLink>
        <NavLink to={user ? "/portal" : "/signin"} className="customer-portal-link" aria-label={user ? "My account" : "Sign in or sign up"}>
          <svg className="nav-account-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>
          <span className="nav-account-label">{user ? "My account" : "Sign in / Sign up"}</span>
        </NavLink>
      </nav>
    </div>
  </header>;
}
