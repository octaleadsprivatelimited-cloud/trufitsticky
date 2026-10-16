import { useState } from 'react';
import { formatDate } from './data.mjs';
import { CompactPanel, CompactTabs, PortalDialog } from './CompactControls';

export default function CustomerDietPlan({ record }) {
  const [selected, setSelected] = useState('');
  const [fullPlan, setFullPlan] = useState(false);
  const plan = record?.published;
  if (!plan) return null;
  const items = [...plan.meals.map(meal => ({id:meal.id,label:meal.label})), ...(plan.notes ? [{id:'plan-notes',label:'Team notes'}] : [])];
  const active = items.some(item => item.id === selected) ? selected : items[0]?.id;
  return <section className="portal-card compact-diet-plan" id="coach-diet-plan"><div className="portal-card-heading"><div><h3 title={plan.title}>{plan.title}</h3><p>From your Tru Fit team · {plan.reviewDate ? `Review ${formatDate(plan.reviewDate)}` : 'Published in preview'}</p></div><button className="portal-quiet-button" type="button" onClick={() => setFullPlan(true)}>Full plan</button></div><CompactTabs id="diet-meals" label="Meal" value={active} items={items} onChange={setSelected}/>{plan.meals.map(meal => <CompactPanel key={meal.id} id="diet-meals" active={active} value={meal.id}><div className="compact-meal"><strong>{meal.label}{meal.time ? ` · ${meal.time} IST` : ''}</strong><p>{meal.food.length > 420 ? `${meal.food.slice(0,420)}…` : meal.food}</p>{meal.food.length > 420 && <button className="portal-quiet-button" type="button" onClick={() => setFullPlan(true)}>Read full meal</button>}</div></CompactPanel>)}{plan.notes && <CompactPanel id="diet-meals" active={active} value="plan-notes"><div className="compact-meal"><strong>Your team’s notes</strong><p>{plan.notes.length > 420 ? `${plan.notes.slice(0,420)}…` : plan.notes}</p>{plan.notes.length > 420 && <button type="button" className="portal-quiet-button" onClick={() => setFullPlan(true)}>Read all notes</button>}</div></CompactPanel>}
    {fullPlan && <PortalDialog title={plan.title} onClose={() => setFullPlan(false)}>{plan.startDate && <p>Starts {formatDate(plan.startDate)}{plan.reviewDate ? ` · Review ${formatDate(plan.reviewDate)}` : ''}</p>}{plan.meals.map(meal => <article className="portal-dialog-section" key={meal.id}><h3>{meal.label}{meal.time ? ` · ${meal.time} IST` : ''}</h3><p>{meal.food}</p></article>)}{plan.notes && <article className="portal-dialog-section"><h3>Team notes</h3><p>{plan.notes}</p></article>}<small>Added in the local team preview.</small></PortalDialog>}
  </section>;
}
