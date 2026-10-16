import { useState } from 'react';
import { blankDiet, formatTeamDate, updateDiet, validateDiet } from './store.mjs';

export default function DietEditor({ customer, workspace, saveWorkspace }) {
  const record = workspace.diets[customer.id];
  const [plan, setPlan] = useState(() => structuredClone(record?.draft || record?.published || blankDiet()));
  const [section, setSection] = useState('plan'), [mealIndex, setMealIndex] = useState(0);
  const [notice, setNotice] = useState(''), [error, setError] = useState(''), [dirty, setDirty] = useState(false);
  const selected = Math.min(mealIndex,Math.max(0,plan.meals.length - 1)), meal = plan.meals[selected];
  function update(key, value) { setPlan(current => ({ ...current, [key]: value })); setDirty(true); setNotice(''); setError(''); }
  function updateMeal(key, value) { update('meals', plan.meals.map(item => item.id === meal.id ? { ...item, [key]: value } : item)); }
  function save(publish) {
    const failure = publish ? validateDiet(plan) : '';
    if (failure) { setError(failure); if (!plan.title.trim() || (plan.startDate && plan.reviewDate && plan.reviewDate < plan.startDate)) setSection('plan'); else { setSection('meals'); const invalid = plan.meals.findIndex(item => !item.label.trim() || !item.food.trim()); if (invalid >= 0) setMealIndex(invalid); } return; }
    try {
      saveWorkspace(updateDiet(workspace, customer.id, plan, publish)); setDirty(false); setError('');
      setNotice(publish ? `Published for ${customer.name.split(' ')[0]} in this local preview.` : 'Draft saved. Customer view unchanged.');
    } catch { setError('Could not save. Keep your edits open and try again.'); }
  }
  function unpublish() {
    try { saveWorkspace({ ...workspace, diets: { ...workspace.diets, [customer.id]: { ...record, published: null, publishedAt: null } } }); setNotice('Plan unpublished. Your draft is kept.'); }
    catch { setError('Could not unpublish. Please try again.'); }
  }
  return <form className="team-card team-diet-editor" noValidate onSubmit={event => { event.preventDefault(); save(true); }}>
    <div className="team-section-heading"><div><h2>Diet plan</h2><p>Your meal guidance for {customer.name.split(' ')[0]}.</p></div><span className="team-status">{record?.published ? 'Published' : record?.draft ? 'Draft' : 'Not assigned'}</span></div>
    <div className="team-editor-tabs" role="group" aria-label="Diet editor sections">{[['plan','Plan details'],['meals','Meals'],['notes','Notes & visibility']].map(([id,label]) => <button type="button" key={id} aria-pressed={section === id} onClick={() => setSection(id)}>{label}</button>)}</div>
    <div className="team-edit-pane" key={section}>
    {section === 'plan' && <><label className="team-field">Plan title<input value={plan.title} maxLength={160} placeholder="e.g. Your weekly meal plan" onChange={event => update('title',event.target.value)}/></label><div className="team-field-grid"><label className="team-field">Start date · optional<input type="date" value={plan.startDate} onChange={event => update('startDate',event.target.value)}/></label><label className="team-field">Review date · optional<input type="date" value={plan.reviewDate} min={plan.startDate || undefined} onChange={event => update('reviewDate',event.target.value)}/></label></div><div className="team-preference-summary"><strong>Customer preferences</strong><span>Diet: {customer.profileValues.dietPreference || 'Not provided'}</span><span>Allergies: {customer.profileValues.allergies || 'Not provided'}</span><span>Avoid: {customer.profileValues.avoidFoods || 'Not provided'}</span></div></>}
    {section === 'meals' && <><div className="team-meal-picker"><label className="team-field">Edit meal<select value={selected} onChange={event => setMealIndex(Number(event.target.value))}>{plan.meals.map((item,index) => <option key={item.id} value={index}>{index + 1}. {item.label || 'Untitled meal'}</option>)}</select></label><button className="team-button team-button-outline" type="button" onClick={() => { update('meals',[...plan.meals,{id:crypto.randomUUID(),label:'',time:'',food:''}]); setMealIndex(plan.meals.length); }}>Add meal</button></div>{meal ? <><div className="team-meal-top"><label className="team-field">Meal name<input value={meal.label} maxLength={80} onChange={event => updateMeal('label',event.target.value)}/></label><label className="team-field">Time · optional<input type="time" value={meal.time} onChange={event => updateMeal('time',event.target.value)}/></label><button className="team-text-button" type="button" onClick={() => update('meals',plan.meals.filter(item => item.id !== meal.id))}>Remove meal</button></div><label className="team-field">Foods, portions & alternatives<textarea rows={3} maxLength={3000} value={meal.food} onChange={event => updateMeal('food',event.target.value)} placeholder="Enter the guidance prepared by your team…"/></label></> : <p>Add a meal to start your plan.</p>}</>}
    {section === 'notes' && <><label className="team-field">Plan notes · optional<textarea rows={3} maxLength={4000} value={plan.notes} onChange={event => update('notes',event.target.value)} placeholder="Preparation, substitutions, and review notes…"/></label><p className="team-fine-print">Only the published version appears in the customer panel. A saved draft keeps the previous published version visible. No email is sent.</p><p className="team-fine-print">Last published: {formatTeamDate(record?.publishedAt)}</p>{record?.published && <><details className="team-published-preview"><summary>View published version</summary><h4>{record.published.title}</h4>{record.published.meals.map(item => <article key={item.id}><strong>{item.label}{item.time ? ` · ${item.time} IST` : ''}</strong><p>{item.food}</p></article>)}{record.published.notes && <p>{record.published.notes}</p>}</details><button className="team-text-button" type="button" onClick={unpublish}>Unpublish diet plan</button></>}</>}
    </div>
    {error && <p className="team-feedback" role="alert">{error}</p>}{notice && <p className="team-feedback" role="status">{notice}</p>}
    <div className="team-editor-actions"><button className="team-button team-button-outline" type="button" onClick={() => save(false)}>Save draft</button><button className="team-button" type="submit">Publish diet plan</button>{dirty && <span>Unsaved changes</span>}</div>
  </form>;
}
