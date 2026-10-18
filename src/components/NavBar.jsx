import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Logo from '../assets/logo-original.svg';
import LogoText from '../assets/footer-logo-text.svg';
export default function NavBar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const expanded = open === pathname;
  return <header className="site-header">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="site-nav wrap">
      <Link className="brand" to="/" aria-label="Tru Fit home"><img src={Logo} alt=""/><img className="original-wordmark" src={LogoText} alt=""/></Link>
      <button className="menu-button" aria-expanded={expanded} aria-controls="site-links" onClick={() => setOpen(expanded ? false : pathname)}>{expanded ? 'Close' : 'Menu'}</button>
      <nav id="site-links" className={expanded ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
        <NavLink to="/coaches">Our coaches</NavLink><NavLink to="/blog">Blog</NavLink>
        <NavLink to={user ? "/portal" : "/signin"} className="customer-portal-link">{user ? "My account" : "Sign in / Sign up"}</NavLink>
        <Link className="button button-small" to="/findmycoach" data-track="cta_click" data-source="navigation">Find my coach</Link>
      </nav>
    </div>
  </header>;
}
