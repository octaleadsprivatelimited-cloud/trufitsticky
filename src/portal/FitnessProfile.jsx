import { useState } from 'react';
import { CompactPanel, CompactTabs, PortalDialog } from './CompactControls';
import { emptyProfile, PROFILE_KEY, readProfile, saveProfile } from './profile.mjs';
import './member-wellness.css';
import useWorkspace from '../team/useWorkspace';
import CustomerDietPlan from './CustomerDietPlan';
import { demoAccount } from './data.mjs';

const profileSections = [{id:'measurements',label:'Measurements'},{id:'training',label:'Training'},{id:'routine',label:'Routine'},{id:'food',label:'Food preferences'},{id:'meals',label:'Meal routine'},{id:'plan',label:'My diet plan'}];
const choices = {
  goal: ['Build strength', 'Improve fitness', 'Manage weight', 'Build muscle', 'Improve mobility', 'Build a consistent routine', 'Something else'],
  experience: ['Just starting', 'Some experience', 'Regular training', 'Experienced'],
  activity: ['Mostly sitting', 'Some daily movement', 'Active most days', 'Very active'],
  trainingLocation: ['Home', 'Gym', 'Home and gym', 'Outdoors'],
  dietPreference: ['Vegetarian', 'Vegan', 'Eggetarian', 'Non-vegetarian', 'Pescatarian', 'No preference', 'Other'],
};
function Field({ name, label, values, update, type = 'text', options, placeholder, min, max, step, wide = false, multiline = false }) {
  const props = { id: `fitness-${name}`, name, value: values[name], onChange: event => update(name, event.target.value), ...(min != null ? { min } : {}), ...(max != null ? { max } : {}), ...(step ? { step } : {}) };
  return <label className={`wellness-field ${wide ? 'is-wide' : ''}`} htmlFor={props.id}><span>{label}</span>{options ? <select {...props}><option value="">Select an option</option>{options.map(option => <option key={option}>{option}</option>)}</select> : multiline ? <textarea {...props} rows={2} maxLength={1500} placeholder={placeholder}/> : <input {...props} type={type} maxLength={type === 'text' ? 300 : undefined} placeholder={placeholder}/>}</label>;
}
export default function FitnessProfile() {
  const [active, setActive] = useState('measurements');
  const [options, setOptions] = useState(false);
  const [workspace] = useWorkspace();
  const dietRecord = workspace.diets[demoAccount.id];
  const [saved, setSaved] = useState(readProfile);
  const [values, setValues] = useState(() => ({ ...saved.values }));
  const [notice, setNotice] = useState('');
  const [clearing, setClearing] = useState(false);
  const dirty = Object.keys(emptyProfile).some(key => values[key] !== saved.values[key]);
  const field = (name, label, rest = {}) => <Field key={name} name={name} label={label} values={values} update={(key, value) => { setValues(current => ({ ...current, [key]: value })); setNotice(''); setClearing(false); }} options={choices[name]} {...rest}/>;
  function save(event) {
    event.preventDefault();
    const limits = {weight:[1,500,'measurements'],height:[30,300,'measurements'],targetWeight:[1,500,'measurements'],trainingDays:[0,7,'training'],sleep:[0,24,'routine'],meals:[1,12,'food'],water:[0,20,'meals']};
    for (const [key,[min,max,group]] of Object.entries(limits)) {
      if (values[key] !== '' && (!Number.isFinite(Number(values[key])) || Number(values[key]) < min || Number(values[key]) > max || (['trainingDays','meals'].includes(key) && !Number.isInteger(Number(values[key]))))) { setActive(group); setNotice(`Check ${({targetWeight:'target weight',trainingDays:'training days',sleep:'sleep hours',meals:'meals per day',water:'water intake'})[key] || key}: enter a value from ${min} to ${max}.`); return; }
    }
    try { setSaved(saveProfile(values)); setNotice('Saved in this tab. Available in the team preview.'); }
    catch { setNotice('Your browser could not save the profile. Keep this page open to retain your edits.'); }
  }
  function clear() {
    try { sessionStorage.removeItem(PROFILE_KEY); }
    catch { setNotice('Your browser could not clear the saved profile. Please try again.'); return; }
    setValues({ ...emptyProfile }); setSaved({ values: { ...emptyProfile }, savedAt: null }); setClearing(false); setNotice('Your saved preview profile has been cleared.');
  }
  return <div className="member-wellness compact-profile" data-clarity-mask="true">
    <div className="portal-view-heading"><div><h2>Your fitness & diet</h2><p>One section at a time. All fields are optional.</p></div><button type="button" className="portal-quiet-button" onClick={() => setOptions(true)}>Options</button></div>
    <div className="compact-profile-snapshot"><span>Weight <strong>{saved.values.weight ? `${saved.values.weight} kg` : 'Not added'}</strong></span><span>Height <strong>{saved.values.height ? `${saved.values.height} cm` : 'Not added'}</strong></span><span className="compact-profile-saved">{dirty ? 'Unsaved changes' : saved.savedAt ? 'Saved in this tab' : 'No saved profile'}</span></div>
    <CompactTabs id="fitness" label="Profile section" value={active} items={profileSections} onChange={setActive}/>
    <form className="wellness-form compact-profile-form" onSubmit={save} autoComplete="off">
      <div className="compact-profile-content">
      <CompactPanel id="fitness" active={active} value="measurements">{active === 'measurements' && <div className="portal-card"><h3>Measurements & goal</h3><div className="wellness-fields">{field('weight','Current weight (kg)',{type:'number',min:1,max:500,step:'0.1',placeholder:'e.g. 72.5'})}{field('height','Height (cm)',{type:'number',min:30,max:300,step:'0.1',placeholder:'e.g. 175'})}{field('targetWeight','Target weight (kg)',{type:'number',min:1,max:500,step:'0.1',placeholder:'Optional'})}{field('goal','Main fitness goal')}</div></div>}</CompactPanel>
      <CompactPanel id="fitness" active={active} value="training">{active === 'training' && <div className="portal-card"><h3>Your training</h3><div className="wellness-fields">{field('experience','Training experience')}{field('activity','Daily activity')}{field('trainingLocation','Where do you train?')}{field('trainingDays','Days per week',{type:'number',min:0,max:7,step:'1',placeholder:'0–7'})}</div></div>}</CompactPanel>
      <CompactPanel id="fitness" active={active} value="routine">{active === 'routine' && <div className="portal-card"><h3>Your routine</h3><div className="wellness-fields">{field('sleep','Sleep (hours/night)',{type:'number',min:0,max:24,step:'0.5',placeholder:'e.g. 7.5'})}{field('equipment','Equipment you own',{placeholder:'Mat, bands, dumbbells…'})}{field('limitations','Movement limits',{multiline:true,placeholder:'Anything to consider?'})}{field('notes','Routine notes',{multiline:true,placeholder:'Schedule, meal prep time…'})}</div></div>}</CompactPanel>
      <CompactPanel id="fitness" active={active} value="food">{active === 'food' && <div className="portal-card"><h3>Food preferences</h3><div className="wellness-fields">{field('dietPreference','Diet preference')}{field('meals','Meals per day',{type:'number',min:1,max:12,step:'1',placeholder:'e.g. 3'})}{field('allergies','Allergies / intolerances',{placeholder:'Dairy, peanuts, or none'})}{field('avoidFoods','Foods to avoid',{placeholder:'Your preferences'})}</div></div>}</CompactPanel>
      <CompactPanel id="fitness" active={active} value="meals">{active === 'meals' && <div className="portal-card"><h3>Your meal routine</h3><div className="wellness-fields">{field('water','Water per day (litres)',{type:'number',min:0,max:20,step:'0.1',placeholder:'e.g. 2.5'})}{field('usualMeals','A usual day of eating',{multiline:true,wide:true,placeholder:'Breakfast, lunch, dinner, snacks, and usual times…'})}</div></div>}</CompactPanel>
      <CompactPanel id="fitness" active={active} value="plan">{dietRecord?.published ? <CustomerDietPlan record={dietRecord}/> : <div className="portal-card portal-small-empty"><h3>Your diet plan</h3><p>Your team’s published meal plan will appear here.</p><span className="portal-status">Awaiting coach plan</span></div>}</CompactPanel>
      </div>
      <div className="compact-profile-actions"><p role="status">{notice || (dirty ? 'You have unsaved changes.' : saved.savedAt ? `Saved ${new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',hour:'numeric',minute:'2-digit'}).format(new Date(saved.savedAt))} IST` : 'Save to keep your entries in this tab.')}</p><button className="portal-button" type="submit" disabled={!dirty}>Save profile</button></div>
    </form>
    {options && <PortalDialog title="Profile options" onClose={() => { setOptions(false); setClearing(false); }}><p>Profile details stay in this browser tab, are available to the local team preview, and clear on sign-out. Use sample information here.</p>{clearing ? <div className="portal-dialog-actions"><p>Clear your saved fitness profile? Your team’s diet plan stays available.</p><button type="button" className="portal-button" onClick={() => { clear(); setOptions(false); }}>Clear profile</button><button type="button" className="portal-quiet-button" onClick={() => setClearing(false)}>Keep profile</button></div> : <button type="button" className="portal-quiet-button" onClick={() => setClearing(true)}>Clear saved preview profile</button>}</PortalDialog>}
  </div>;
}
