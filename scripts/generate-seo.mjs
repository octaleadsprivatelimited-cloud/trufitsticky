import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { loadEnv } from 'vite';
import { pages, siteOrigin, escapeHtml, structuredData } from '../src/seo/routes.mjs';
const env={...loadEnv('production',process.cwd(),''),...process.env};
const origin=siteOrigin(env.VITE_SITE_URL);
const dist=resolve('dist');
const base=(await readFile(join(dist,'index.html'),'utf8')).replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>').replace(/<script id="trufit-schema"[^>]*>[\s\S]*?<\/script>/g,'').replace(/<meta name="(?:google-site-verification|msvalidate\.01)"[^>]*>/g,'');
const allPages={...pages};
const seoApiUrl=env.SEO_API_URL||env.VITE_BASE_URL;
if(seoApiUrl){
 try{
  const response=await fetch(seoApiUrl.replace(/\/$/,'')+'/admin_functions/coach-profiles/',{signal:AbortSignal.timeout(4000)});
  if(!response.ok)throw new Error('catalogue unavailable');
  const data=await response.json();const coaches=Array.isArray(data)?data:(data.results||[]);
  for(const c of coaches){const slug=c.profile_slug||String(c.name||'').toLowerCase().replace(/\s+/g,'');if(c.status==='hard'||!slug||!/^[a-z0-9][a-z0-9_-]{0,99}$/i.test(slug))continue;
   allPages['/coaches/'+slug]={title:`${c.name} — Coach Profile & Plans | Tru Fit`,heading:c.name,description:`Explore ${c.name}’s coaching approach, experience, plans, and consultation options at Tru Fit.`};}
 }catch{console.warn('SEO: coach API unavailable; sitemap includes public pages. Run npm run seo again when the API is available to include live coach profiles.')}
}
function htmlFor(path,page,noindex=false){
 let html=base.replace(/<title>[^<]*<\/title>/,'<title>'+escapeHtml(page.title)+'</title>');
 html=html.replace(/<meta name="description"[^>]*>/,'<meta name="description" content="'+escapeHtml(page.description)+'"/>');
 html=html.replace(/<meta name="robots"[^>]*>/,`<meta name="robots" content="${noindex?'noindex, nofollow':'index, follow, max-image-preview:large'}"/>`);
 html=html.replace(/<link rel="canonical"[^>]*>/,`<link rel="canonical" href="${escapeHtml(origin+path)}"/>`);
 for(const [name,value] of [['og:title',page.title],['og:description',page.description],['og:url',origin+path],['og:image',origin+'/og-image.jpg']])html=html.replace(new RegExp('<meta property="'+name+'"[^>]*>'),`<meta property="${name}" content="${escapeHtml(value)}"/>`);
 for(const [name,value] of [['twitter:title',page.title],['twitter:description',page.description],['twitter:image',origin+'/og-image.jpg']])html=html.replace(new RegExp('<meta name="'+name+'"[^>]*>'),`<meta name="${name}" content="${escapeHtml(value)}"/>`);
 let verification='';
 for(const [name,value] of [['google-site-verification',env.VITE_GOOGLE_SITE_VERIFICATION],['msvalidate.01',env.VITE_BING_SITE_VERIFICATION]])if(value)verification+=`<meta name="${name}" content="${escapeHtml(value)}"/>\n`;
 html=html.replace('</head>',verification+`<script id="trufit-schema" type="application/ld+json">${JSON.stringify(structuredData(origin)).replace(/</g,'\\u003c')}</script>\n</head>`);
 // Crawlable route-specific text and real navigation are present before JavaScript executes.
 const staticContent=`<main style="font-family:system-ui;max-width:1000px;margin:70px auto;padding:24px"><a href="/">Tru Fit</a><h1>${escapeHtml(page.heading||page.title)}</h1><p>${escapeHtml(page.description)}</p><nav aria-label="Explore Tru Fit">${Object.entries(pages).map(([href,p])=>`<a style="margin-right:20px" href="${href}">${escapeHtml(p.heading)}</a>`).join('')}</nav></main>`;
 html=html.replace('<div id="root"></div>',`<div id="root">${staticContent}</div>`);
 return html;
}
for(const [path,page] of Object.entries(allPages)){
 const file=path==='/'?join(dist,'index.html'):join(dist,path.slice(1)+'.html');await mkdir(dirname(file),{recursive:true});await writeFile(file,htmlFor(path,page));
}
for(const path of ['/survey','/payment/callback','/payment/couple']){const file=join(dist,path.slice(1)+'.html');await mkdir(dirname(file),{recursive:true});await writeFile(file,htmlFor(path,{title:'Private Booking | Tru Fit',description:'Tru Fit booking and payment flow.',heading:'Tru Fit'},true))}
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(allPages).map(path=>`  <url><loc>${escapeHtml(origin+path)}</loc></url>`).join('\n')}\n</urlset>\n`;
const robots=`User-agent: *\nAllow: /\nDisallow: /admin_functions/\nDisallow: /api/\nDisallow: /backend/\n\nSitemap: ${origin}/sitemap.xml\n`;
await writeFile(join(dist,'sitemap.xml'),sitemap);await writeFile(join(dist,'robots.txt'),robots);
await writeFile(resolve('public/sitemap.xml'),sitemap);await writeFile(resolve('public/robots.txt'),robots);
console.log(`SEO: generated ${Object.keys(allPages).length} crawlable pages, sitemap.xml and robots.txt for ${origin}.`);
