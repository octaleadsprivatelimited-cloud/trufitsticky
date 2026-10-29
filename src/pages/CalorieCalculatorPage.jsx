import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ACTIVITY_LEVELS, calculateCalories } from '../calories/core.mjs';
import { scrollToSection } from '../scroll/smoothScroll';
import '../styles/calorie-calculator.css';

const initial = { kg: '', cm: '', lb: '', feet: '', inches: '', age: '', sex: '', activity: '' };
const formatCalories = value => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);

export default function CalorieCalculatorPage({ embedded = false } = {}) {
  const [units, setUnits] = useState('metric');
  const [fields, setFields] = useState(initial);
  const [eligible, setEligible] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const resultHeading = useRef(null);

  useEffect(() => {
    if (!result) return;
    const frame = requestAnimationFrame(() => {
      resultHeading.current?.focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 700px)').matches) scrollToSection(resultHeading.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [result]);

  function clearResult() { setResult(null); setError(''); }
  function update(event) {
    setFields(previous => ({ ...previous, [event.target.name]: event.target.value }));
    clearResult();
  }
  function chooseUnits(value) {
    if (value !== units) { setUnits(value); clearResult(); }
  }
  function calculate(event) {
    event.preventDefault();
    try {
      if (!fields.age.trim()) throw new Error('Enter your age.');
      if (!fields.sex) throw new Error('Choose the equation to use.');
      if (!fields.activity) throw new Error('Choose your usual activity level.');
      const metric = units === 'metric';
      if (metric && (!fields.kg.trim() || !fields.cm.trim())) throw new Error('Enter your weight and height.');
      if (!metric && (!fields.lb.trim() || !fields.feet.trim())) throw new Error('Enter your weight and height.');
      if (!metric && (!Number.isInteger(Number(fields.feet)) || !Number.isInteger(Number(fields.inches || 0)) || Number(fields.inches || 0) < 0 || Number(fields.inches || 0) > 11)) throw new Error('Use whole feet and inches, with inches between 0 and 11.');
      const weightKg = metric ? Number(fields.kg) : Number(fields.lb) * 0.45359237;
      const heightCm = metric ? Number(fields.cm) : (Number(fields.feet) * 12 + Number(fields.inches || 0)) * 2.54;
      setResult(calculateCalories({ weightKg, heightCm, age: Number(fields.age), sex: fields.sex, activity: fields.activity, eligible }));
      setError('');
    } catch (failure) {
      setResult(null);
      setError(failure.message || 'Check your details and try again.');
    }
  }

  const activity = ACTIVITY_LEVELS.find(level => level.key === fields.activity);

  return <div className={`calorie-page${embedded ? ' calorie-embedded' : ' wrap'}`} data-clarity-mask="true">
    {!embedded && <header className="calorie-intro"><h1>The Tru Fit calorie calculator</h1></header>}
    <div className="calorie-workspace">
      <section className="calorie-input-panel" aria-labelledby="calorie-input-title">
        <div className="calorie-section-top"><h2 id="calorie-input-title">Your everyday energy.</h2><span>Adults 18–80</span></div>
        <div className="calorie-unit-switch" role="group" aria-label="Measurement units"><button type="button" aria-pressed={units === 'metric'} onClick={() => chooseUnits('metric')}>Metric <span>kg / cm</span></button><button type="button" aria-pressed={units === 'imperial'} onClick={() => chooseUnits('imperial')}>Imperial <span>lb / ft</span></button></div>
        <form onSubmit={calculate} noValidate>
          {units === 'metric' ? <div className="calorie-fields"><label htmlFor="calorie-weight-kg">Weight<span className="calorie-input-wrap"><input id="calorie-weight-kg" name="kg" type="number" min="20" max="500" step="any" inputMode="decimal" value={fields.kg} onChange={update} placeholder="70" required/><span aria-hidden="true">kg</span></span></label><label htmlFor="calorie-height-cm">Height<span className="calorie-input-wrap"><input id="calorie-height-cm" name="cm" type="number" min="100" max="250" step="any" inputMode="decimal" value={fields.cm} onChange={update} placeholder="170" required/><span aria-hidden="true">cm</span></span></label></div> : <><label className="calorie-field" htmlFor="calorie-weight-lb">Weight<span className="calorie-input-wrap"><input id="calorie-weight-lb" name="lb" type="number" step="any" inputMode="decimal" value={fields.lb} onChange={update} placeholder="154" required/><span aria-hidden="true">lb</span></span></label><div className="calorie-fields calorie-height-fields"><label htmlFor="calorie-height-feet">Height in feet<span className="calorie-input-wrap"><input id="calorie-height-feet" name="feet" type="number" min="3" max="8" step="1" inputMode="numeric" value={fields.feet} onChange={update} placeholder="5" required/><span aria-hidden="true">ft</span></span></label><label htmlFor="calorie-height-inches">Additional inches<span className="calorie-input-wrap"><input id="calorie-height-inches" name="inches" type="number" min="0" max="11" step="1" inputMode="numeric" value={fields.inches} onChange={update} placeholder="0"/><span aria-hidden="true">in</span></span></label></div></>}
          <div className="calorie-fields calorie-details-fields"><label htmlFor="calorie-age">Age<span className="calorie-input-wrap"><input id="calorie-age" name="age" type="number" min="18" max="80" step="1" inputMode="numeric" value={fields.age} onChange={update} placeholder="30" required/><span aria-hidden="true">years</span></span></label><label htmlFor="calorie-sex">Equation<select id="calorie-sex" name="sex" value={fields.sex} onChange={update} required><option value="">Choose equation</option><option value="male">Male equation</option><option value="female">Female equation</option></select></label></div>
          <p className="calorie-field-hint">The formula uses sex-based coefficients. Individual needs vary.</p>
          <label className="calorie-field calorie-activity" htmlFor="calorie-activity">Usual activity<select id="calorie-activity" name="activity" value={fields.activity} onChange={update} required aria-describedby="calorie-activity-description"><option value="">Choose activity level</option>{ACTIVITY_LEVELS.map(level => <option key={level.key} value={level.key}>{level.label}</option>)}</select></label>
          <p id="calorie-activity-description" className="calorie-field-hint">{activity?.description || 'Choose what reflects your usual week, including work and movement.'}</p>
          <label className="calorie-eligibility"><input type="checkbox" checked={eligible} onChange={event => { setEligible(event.target.checked); clearResult(); }}/><span>I am 18 or older and not pregnant or breastfeeding.</span></label>
          {error && <p className="calorie-error" role="alert">{error}</p>}
          <button className="calorie-primary-button" type="submit">Estimate my calories</button>
          <p className="calorie-local-note">Just for you. Nothing is saved or sent.</p>
        </form>
      </section>
      <section className={`calorie-result-panel${result ? ' has-result' : ''}`} aria-labelledby="calorie-result-title" aria-live="polite">
        <h2 id="calorie-result-title" ref={resultHeading} tabIndex={-1}>Estimated daily maintenance</h2>
        <div className="calorie-result-symbol" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M27 5c1 9-10 12-7 21 2-2 4-4 5-7 8 8 12 13 9 19-3 7-16 9-22 1-8-11 5-19 15-34Z"/><path d="M25 29c4 5 6 10 1 13"/></svg></div>
        {result ? <><div className="calorie-result-value"><span>{formatCalories(result.maintenanceMin ?? result.maintenanceCalories)}</span>{result.maintenanceMax != null && <><small>to</small><span>{formatCalories(result.maintenanceMax)}</span></>}</div><p className="calorie-result-unit">kcal per day</p><span className="calorie-activity-pill">{result.activityLabel}</span><div className="calorie-resting"><span>Estimated resting energy (not an intake target)</span><strong>{formatCalories(result.restingCalories)} <small>kcal/day</small></strong></div><p className="calorie-result-description">An estimate to maintain your current weight, based on your details and usual activity.</p></> : <><div className="calorie-result-placeholder">—</div><p className="calorie-result-unit">Your daily energy estimate</p><p className="calorie-result-description">Add your details to see a starting range for your everyday routine.</p></>}
        <p className="calorie-estimate-note">An estimate, not a prescribed diet target.</p>
      </section>
    </div>
    <div className="calorie-footnote"><details><summary>How is this estimated?</summary><div><p>Rounded Mifflin–St Jeor coefficients estimate resting energy from weight, height, age and sex. FAO physical activity factors give a maintenance range for your chosen lifestyle band. This is an illustrative activity range, not a confidence interval or a weight-loss or weight-gain target.</p><p>This tool is for adults aged 18–80 who are not pregnant or breastfeeding. Medical conditions and competitive training can change energy needs; a qualified professional can provide personal guidance.</p><a href="https://pubmed.ncbi.nlm.nih.gov/2305711/" target="_blank" rel="noreferrer">Read the original equation study<span className="calorie-sr-only"> (opens in a new tab)</span></a><a href="https://www.fao.org/4/Y5686e/y5686e07.htm" target="_blank" rel="noreferrer">FAO activity factors<span className="calorie-sr-only"> (opens in a new tab)</span></a></div></details><Link to="/coaches?focus=nutrition">Explore nutrition coaches</Link></div>
  </div>;
}
