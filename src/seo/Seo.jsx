import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pages, DEFAULT_ORIGIN, structuredData } from './routes.mjs';
export default function Seo(){
 const location=useLocation();
 const pathname=location.pathname.replace(/\/$/,'')||'/';
 useEffect(()=>{
  const origin=(import.meta.env.VITE_SITE_URL||DEFAULT_ORIGIN).replace(/\/$/,'');
  const data=pages[pathname]||(pathname.startsWith('/coaches/')?{title:'Personal Coach Profile & Plans | Tru Fit',description:'Explore this Tru Fit coach’s approach, experience, coaching plans, and consultation options.'}:{title:'Tru Fit',description:'Personal fitness coaching that fits your life.'});
  document.title=data.title;
  const meta=(name,content,property=false)=>{const attr=property?'property':'name';let e=document.head.querySelector(`meta[${attr}="${name}"]`);if(!e){e=document.createElement('meta');e.setAttribute(attr,name);document.head.appendChild(e)}e.setAttribute('content',content)};
  meta('description',data.description);meta('og:title',data.title,true);meta('og:description',data.description,true);meta('og:url',origin+pathname,true);meta('twitter:title',data.title);meta('twitter:description',data.description);
  const publicPage=Boolean(pages[pathname])||pathname.startsWith('/coaches/');
  meta('robots',!publicPage||import.meta.env.DEV?'noindex, nofollow':'index, follow, max-image-preview:large');
  let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical)}canonical.href=origin+pathname;
  let schema=document.getElementById('trufit-schema');if(!schema){schema=document.createElement('script');schema.id='trufit-schema';schema.type='application/ld+json';document.head.appendChild(schema)}schema.textContent=JSON.stringify(structuredData(origin));
 },[pathname]);return null;
}
