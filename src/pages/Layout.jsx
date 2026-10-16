import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from '../components/NavBar';
import QuickNavigation from '../components/QuickNavigation';
import SmoothScrolling from '../components/SmoothScrolling';
import { scrollToSection } from '../scroll/smoothScroll';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import CookieConsent from '../analytics/CookieConsent';
import PageInsights from '../analytics/PageInsights';
import Seo from '../seo/Seo';
import PageMotion from '../components/PageMotion';
import '../styles/minimal.css';
import '../styles/editorial.css';
import '../styles/contact.css';
import '../styles/enrolment.css';
import '../styles/brand-theme.css';
export default function Layout(){
 const location=useLocation();
 const landingPage=location.pathname.startsWith('/lp/');
 const portalPage=/^\/(?:portal|team)(?:\/|$)/.test(location.pathname)||location.pathname==='/signin';
 const protectedPage=portalPage||location.pathname.startsWith('/payment')||location.pathname==='/survey';
 const contact=['/','/about','/coaches','/plans','/start'].includes(location.pathname);
 useEffect(()=>{if(location.hash){const t=setTimeout(()=>scrollToSection(document.getElementById(location.hash.slice(1))),150);return()=>clearTimeout(t)}},[location.pathname,location.hash]);
 return <><Seo/><PageInsights/>{!portalPage&&<><PageMotion/><SmoothScrolling/></>}{!landingPage&&!portalPage&&<NavBar/>}<main id="main-content" tabIndex={-1} data-clarity-mask={protectedPage?'true':undefined}><Outlet/>{contact&&<ContactForm/>}</main>{!landingPage&&!portalPage&&!contact&&!location.pathname.startsWith('/payment')&&<Footer/>}{location.pathname==='/'&&<QuickNavigation key={location.pathname}/>}<CookieConsent/><ScrollRestoration/></>;
}
