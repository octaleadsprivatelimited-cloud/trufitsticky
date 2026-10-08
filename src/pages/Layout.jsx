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
export default function Layout(){
 const location=useLocation();
 const landingPage=location.pathname.startsWith('/start/');
 const coachDetail=/^\/coaches\/[^/]+\/?$/.test(location.pathname);
 const protectedPage=location.pathname.startsWith('/payment')||location.pathname==='/survey';
 const contact=['/','/about','/coaches','/plans','/start'].includes(location.pathname);
 useEffect(()=>{if(location.hash){const t=setTimeout(()=>scrollToSection(document.getElementById(location.hash.slice(1))),150);return()=>clearTimeout(t)}},[location.pathname,location.hash]);
 return <><Seo/><PageInsights/><PageMotion/><SmoothScrolling/>{!landingPage&&<NavBar/>}<main id="main-content" tabIndex={-1} data-clarity-mask={protectedPage?'true':undefined}><Outlet/>{contact&&<ContactForm/>}</main>{!landingPage&&!contact&&!location.pathname.startsWith('/payment')&&<Footer/>}{(location.pathname==='/'||coachDetail)&&<QuickNavigation key={location.pathname} coachPage={coachDetail}/>}<CookieConsent/><ScrollRestoration/></>;
}
