import { useState } from 'react';
import { Link } from 'react-router-dom';
import CoupleCheckout from './CoupleCheckout';
import ProgramDescriptionRenderer from './ProgramDescriptionRenderer';
import './couplePlans.css';
import { trackCoachEvent } from '../../analytics/analytics';

const benefits = ['Individual training plans', 'Personal nutrition guidance', 'One coach for both of you', 'A shared start date'];
const formatPrice = (plan, region) => new Intl.NumberFormat(region === 'DOMESTIC' ? 'en-IN' : 'en-US', {
  style: 'currency', currency: plan.currency || (region === 'DOMESTIC' ? 'INR' : 'USD'), minimumFractionDigits: 0, maximumFractionDigits: 2,
}).format(Number(plan.price));

export default function CouplePlans({ coach, plans, region = 'DOMESTIC' }) {
  const [selectedId, setSelectedId] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const plan = plans.find(item => item.id === selectedId) || plans.find(item => item.recommended) || plans[0];
  const firstName = coach.name.trim().split(/\s+/)[0];
  if (!plan) return <div className="couple-panel"><p className="package-step"><span>02</span> Your journey, together</p><div className="couple-empty" data-reveal><div><p className="eyebrow">Two people. One commitment.</p><h3>Shared momentum.<br/>Individual guidance.</h3><p>Work with {firstName} as a pair, with training and nutrition shaped around each person’s goals.</p><ul className="couple-benefits">{benefits.map(item => <li key={item}>{item}</li>)}</ul></div><div className="couple-empty-state"><strong>Pricing coming soon.</strong><p>Couple packages for this coach in {region === 'DOMESTIC' ? 'INR' : 'USD'} will appear here when available.</p><Link className="text-link" to="/#contact-form">Ask us about couple coaching ↗</Link></div></div></div>;
  const capacityRegion = String(plan.category.location).toLowerCase();
  const capacity = coach.dynamic_capacities?.[String(plan.duration_weeks)]?.[capacityRegion];
  const remaining = capacity?.max == null ? null : Math.max(0, Number(capacity.max) - Number(capacity.current || 0));
  const aggregateLimit = coach[`max_${capacityRegion}_clients`];
  const currentTotal = Object.values(coach.dynamic_capacities || {}).reduce((total, entry) => total + Number(entry[capacityRegion]?.current || 0), 0);
  const full = coach.status === 'hard' || (remaining != null && remaining < 2)
    || (aggregateLimit != null && Number(aggregateLimit) - currentTotal < 2);
  const price = formatPrice(plan, region);
  const perPersonWeekly = formatPrice({ ...plan, price: Number(plan.price) / Number(plan.duration_weeks) / 2 }, region);
  const openCheckout = () => { if (!coach.preview) setShowCheckout(true); };
  const action = coach.preview ? 'Booking disabled in preview' : full ? 'Join couple waitlist' : 'Choose couple plan';
  return <div className="couple-panel">
    <p className="package-step"><span>02</span> Choose your shared timeline</p>
    <div className="package-body"><div className="package-options"><div className="couple-options" aria-label="Couple coaching duration">{plans.map(item => <button className="couple-option" type="button" key={item.id} aria-label={`${item.duration_weeks} week couple plan${item.id === plan.id ? ', selected' : ''}`} aria-pressed={item.id === plan.id} onClick={() => { setSelectedId(item.id); trackCoachEvent('select_plan', coach, { plan_type: 'couple', plan_id: String(item.id), duration_weeks: Number(item.duration_weeks), pricing_region: region, value: Number(item.price), currency: item.currency || (region === 'DOMESTIC' ? 'INR' : 'USD') }); }}>{item.recommended && <span className="package-recommended">Coach recommended</span>}<span className="selection-dot" aria-hidden="true"/><span className="package-duration">{item.duration_weeks} Weeks</span><span className="package-card-caption">Coaching for two people</span><span className="package-option-price">{formatPrice(item,region)} <small>total</small></span><span className="package-card-weekly">Both participants included</span></button>)}</div><p className="summary-note">Each person gets their own training and nutrition guidance. Both participants start together.</p></div>
      <aside className="cpx-selected-summary" aria-label="Selected couple plan summary" aria-live="polite"><p className="eyebrow">Your plan at a glance</p><h3>{plan.duration_weeks}-week couple coaching</h3><p className="summary-coach">Two people · with {firstName}</p><p className="summary-price">{price} <small>total for both</small></p><p className="summary-rate">About {perPersonWeekly} / person / week</p><ul className="summary-inclusions">{benefits.map(item => <li key={item}>{item}</li>)}</ul><button className="couple-primary" type="button" disabled={coach.preview} onClick={openCheckout}>{action} ↗</button><p className="summary-note">One payment for both participants. No automatic renewal.</p>{full && <p className="couple-footnote">This program needs two available places. Join the waitlist to hear about an opening.</p>}</aside>
    </div>
    {plan.description_blocks?.length > 0 && <details className="cpx-collapse couple-description" open><summary>What’s included for both participants</summary><div className="cpx-collapse-body"><ProgramDescriptionRenderer blocks={plan.description_blocks}/></div></details>}
    <div className="cpx-sticky"><div className="cpx-sticky-inner couple-sticky-inner"><div className="cpx-sticky-info"><div className="cpx-sticky-name">{coach.name}</div><div className="cpx-sticky-sub"><span className="cpx-sticky-plan">Couple · {plan.duration_weeks} weeks</span><span className="cpx-sticky-price">{price} for both</span></div></div><button className="cpx-sticky-btn" type="button" disabled={coach.preview} onClick={openCheckout}>{coach.preview ? 'Local preview' : full ? 'Join waitlist' : 'Choose couple plan'}</button></div></div>
    {showCheckout && <CoupleCheckout coach={coach} plan={plan} waitlist={full} onClose={() => setShowCheckout(false)}/>}
  </div>;
}
