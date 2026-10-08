import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { analytics } from './analytics';
export default function CookieConsent(){
 const [open,setOpen]=useState(!analytics.readConsent());
 const [editing,setEditing]=useState(false);
 const [error,setError]=useState('');
 const acceptRef=useRef(null), previousFocus=useRef(null);
 useEffect(()=>{const openPreferences=()=>{previousFocus.current=document.activeElement;setEditing(true);setOpen(true)};window.addEventListener('trufit-open-privacy',openPreferences);return()=>window.removeEventListener('trufit-open-privacy',openPreferences)},[]);
 useEffect(()=>{if(!editing||!open)return;acceptRef.current?.focus();const key=e=>{if(e.key==='Escape'){setOpen(false);previousFocus.current?.focus()}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[editing,open]);
 const choose=choice=>{if(!analytics.setConsent(choice)){setError("We couldn’t save your preference. Please enable browser storage and try again.");return;}setError('');setOpen(false);previousFocus.current?.focus()};
 if(!open)return null;
 return <aside className="cookie-banner" role="region" aria-label="Cookie preferences"><h2>A little insight. Your choice.</h2><p>With your permission, we use Google Analytics and Microsoft Clarity to understand visits, clicks, and page usage. You can decline and keep browsing. <Link to="/privacy-policy">Read our privacy policy</Link>.</p>{error&&<p role="alert">{error}</p>}<div className="cookie-actions"><button className="button button-outline" onClick={()=>choose(false)}>Essential only</button><button className="button" ref={acceptRef} onClick={()=>choose(true)}>Allow analytics</button></div></aside>;
}
