import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAnalytics, cleanUrl, safeParams, CONSENT_KEY } from './core.mjs';
function runtime(path='/'){
 const saved=new Map(), scripts=[], notifications=[];let reloads=0;
 const w={localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},location:{pathname:path,origin:'https://www.betrufit.com',hostname:'www.betrufit.com',reload:()=>reloads++},Event:class{constructor(name){this.type=name}},dispatchEvent:e=>notifications.push(e)};
 const d={title:'Tru Fit',referrer:'https://example.com/?email=private@example.com',cookie:'',head:{appendChild:s=>scripts.push(s)},getElementById:id=>scripts.find(s=>s.id===id),createElement:()=>({})};
 const client=createAnalytics({ga4Id:'G-TEST123',clarityId:'test1234',enabled:true},w,d);
 return {w,d,client,scripts,saved,reloads:()=>reloads};
}
test('no vendor loads, event sends, or dataLayer before opt-in',()=>{const r=runtime();r.client.page('/','Home');assert.equal(r.client.track('generate_lead',{form_id:'contact'}),false);assert.equal(r.scripts.length,0);assert.equal(r.w.dataLayer,undefined);r.client.setConsent(false);assert.equal(r.scripts.length,0)});
test('opt-in loads validated vendors once and records one page view across duplicate renders',()=>{const r=runtime();r.client.page('/','Home');r.client.setConsent(true);r.client.page('/','Home');r.client.page('/coaches','Coaches');r.client.page('/coaches','Coaches');assert.equal(r.scripts.length,2);const views=r.w.dataLayer.filter(a=>a[0]==='event'&&a[1]==='page_view');assert.equal(views.length,2);assert.equal(views[1][2].page_referrer,'https://www.betrufit.com/');assert.equal(views[0][2].page_referrer,'https://example.com/');assert.equal(r.w.clarity.q[0][1].ad_Storage,'denied')});
test('personal fields and arbitrary event names cannot enter analytics',()=>{const r=runtime();r.client.setConsent(true);assert.equal(r.client.track('email_submit',{email:'person@example.com'}),false);r.client.track('generate_lead',{form_id:'contact',email:'person@example.com',phone:'123',goal:'medical detail',page_location:'https://www.betrufit.com/coaches?email=private@example.com'});const e=r.w.dataLayer.at(-1);assert.deepEqual(e[2],{form_id:'contact',page_location:'https://www.betrufit.com/'});assert.deepEqual(safeParams({source:'private@example.com',value:NaN}),{})});
test('checkout and health-questionnaire pages do not initialize SDKs',()=>{for(const path of ['/survey','/payment/callback','/payment/couple']){const r=runtime(path);r.client.setConsent(true);r.client.page(path,'Booking');assert.equal(r.scripts.length,0);assert.equal(r.client.track('form_start',{form_id:'payment'}),false)}});
test('entering private flow drops loaded SDKs; withdrawal reloads with persisted denial',()=>{const r=runtime();r.client.setConsent(true);r.client.page('/payment/couple','Booking');assert.equal(r.reloads(),1);r.client.setConsent(false);assert.equal(JSON.parse(r.saved.get(CONSENT_KEY)).analytics,false);assert.equal(r.reloads(),2)});
test('expired and malformed consent never enable tracking',()=>{const r=runtime();r.saved.set(CONSENT_KEY,JSON.stringify({version:1,analytics:true,updatedAt:1}));r.client.page('/','Home');assert.equal(r.scripts.length,0);r.saved.set(CONSENT_KEY,'broken');assert.equal(r.client.readConsent(),null)});
test('URLs exclude all queries and fragments',()=>{assert.equal(cleanUrl('https://example.com/path?token=secret#email'),'https://example.com/path')});

test("disabled development tracking does not load vendors after opt-in",()=>{const r=runtime();const client=createAnalytics({ga4Id:"G-TEST123",clarityId:"test1234",enabled:false},r.w,r.d);client.setConsent(true);client.page("/plans","Plans");assert.equal(r.scripts.length,0);assert.equal(r.w.dataLayer,undefined)});
test('every coach is attributed separately in GA4 and Clarity without repeated profile views',()=>{
 const r=runtime('/coaches/first');r.client.setConsent(true);
 const first={id:12,name:'First Coach',profile_slug:'first',coach_level:'senior'};
 r.client.coach(first,'/coaches/first','First Coach');r.client.coach(first,'/coaches/first','First Coach');
 r.client.track('select_plan',{duration_weeks:24,pricing_region:'DOMESTIC'});
 r.client.page('/coaches/second','Second Coach');r.client.coach({id:13,name:'Second Coach',profile_slug:'second',coach_level:'expert'},'/coaches/second','Second Coach');
 const views=r.w.dataLayer.filter(a=>a[0]==='event'&&a[1]==='view_coach');assert.equal(views.length,2);assert.deepEqual(views.map(a=>a[2].coach_id),['12','13']);
 const selected=r.w.dataLayer.find(a=>a[0]==='event'&&a[1]==='select_plan');assert.equal(selected[2].coach_name,'First Coach');assert.equal(selected[2].duration_weeks,24);
 assert.ok(r.w.clarity.q.some(a=>a[0]==='set'&&a[1]==='coach_slug'&&a[2]==='second'));
 assert.ok(r.w.clarity.q.some(a=>a[0]==='event'&&a[1]==='select_plan_coach_12'));
 r.client.page('/plans','Plans');r.client.track('form_start',{form_id:'contact'});assert.equal(r.w.dataLayer.at(-1)[2].coach_id,undefined);
});
test('consenting on an already-open coach profile records that coach once',()=>{
 const r=runtime('/coaches/first');r.client.coach({id:12,name:'First Coach',profile_slug:'first'},'/coaches/first','First Coach');assert.equal(r.scripts.length,0);
 r.client.setConsent(true);const views=r.w.dataLayer.filter(a=>a[0]==='event'&&a[1]==='view_coach');assert.equal(views.length,1);assert.equal(views[0][2].coach_id,'12');
});

test('sales landing pages attribute coach actions and clear context on leaving',()=>{
 const r=runtime('/lp/jaswant-medidi');r.client.setConsent(true);
 r.client.coach({id:9,name:'Jaswant Medidi',profile_slug:'jaswant-medidi',coach_level:'juniorplus'},'/lp/jaswant-medidi','Train with Jaswant');
 r.client.track('contact_click',{source:'landing_whatsapp'});
 const contact=r.w.dataLayer.find(a=>a[0]==='event'&&a[1]==='contact_click');
 assert.equal(contact[2].coach_id,'9');assert.equal(contact[2].source,'landing_whatsapp');
 const view=r.w.dataLayer.find(a=>a[0]==='event'&&a[1]==='view_coach');assert.equal(view[2].coach_slug,'jaswant-medidi');
 assert.ok(r.w.dataLayer.some(a=>a[0]==='event'&&a[1]==='page_view'&&a[2].content_group==='coach_landing'));
 r.client.page('/','Home');r.client.track('cta_click',{source:'home'});assert.equal(r.w.dataLayer.at(-1)[2].coach_id,undefined);
});
