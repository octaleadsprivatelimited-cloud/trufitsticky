import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useBlog from '../blog/useBlog';
import { visiblePosts } from '../blog/store.mjs';
import { pages, DEFAULT_ORIGIN, structuredData } from './routes.mjs';
export default function Seo(){
 const location=useLocation();
 const [blog]=useBlog();
 const pathname=location.pathname.replace(/\/$/,'')||'/';
 useEffect(()=>{
  const origin=(import.meta.env.VITE_SITE_URL||DEFAULT_ORIGIN).replace(/\/$/,'');
  const portalTitles={'/signin':'Sign in or Sign up','/signup':'Sign up','/portal':'Your Overview','/portal/programs':'My Programs','/portal/profile':'Fitness & Diet','/portal/products':'Training Essentials','/portal/referrals':'Refer a Friend','/portal/invoices':'Invoices & Payments'};
  const localPost=pathname.startsWith('/blog/')?visiblePosts(blog).find(a=>'/blog/'+a.slug===pathname):null;
  const data=(localPost?{title:localPost.title+' | Tru Fit journal',description:localPost.excerpt}:null)||(pathname.startsWith('/coach/')||pathname==='/coach'?{title:'Coach Workspace | Tru Fit',description:'Tru Fit coach browser preview.'}:null)||(pathname.startsWith('/team')?{title:'Tru Fit Team Workspace',description:'Tru Fit team customer care workspace.'}:null)||pages[pathname]||(portalTitles[pathname]?{title:`${portalTitles[pathname]} | Tru Fit Member Portal`,description:'Your coaching programs, days with Tru Fit, referrals, and paid invoices.'}:null)||(pathname.startsWith('/coaches/')?{title:'Personal Coach Profile & Plans | Tru Fit',description:'Explore this Tru Fit coach’s approach, experience, coaching plans, and consultation options.'}:{title:'Tru Fit',description:'Personal fitness coaching that fits your life.'});
  document.title=data.title;
  const meta=(name,content,property=false)=>{const attr=property?'property':'name';let e=document.head.querySelector(`meta[${attr}="${name}"]`);if(!e){e=document.createElement('meta');e.setAttribute(attr,name);document.head.appendChild(e)}e.setAttribute('content',content)};
  meta('description',data.description);meta('og:title',data.title,true);meta('og:description',data.description,true);meta('og:url',origin+pathname,true);meta('twitter:title',data.title);meta('twitter:description',data.description);
  const publicPage=Boolean(pages[pathname])||pathname.startsWith('/coaches/');
  meta('robots',!publicPage||localPost?.localPreview||import.meta.env.DEV?'noindex, nofollow':'index, follow, max-image-preview:large');
  let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical)}canonical.href=origin+pathname;
  let schema=document.getElementById('trufit-schema');if(!schema){schema=document.createElement('script');schema.id='trufit-schema';schema.type='application/ld+json';document.head.appendChild(schema)}schema.textContent=JSON.stringify(structuredData(origin));
 },[pathname,blog]);return null;
}
