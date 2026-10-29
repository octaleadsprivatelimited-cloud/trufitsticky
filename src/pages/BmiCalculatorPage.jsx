import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateBmi } from '../bmi/core.mjs';
import { bmiGuidance } from '../bmi/guidance.mjs';
import { scrollToSection } from '../scroll/smoothScroll';
import '../styles/bmi-calculator.css';

const categories = [
  { key: 'underweight', label: 'Underweight', range: 'Below 18.5' },
  { key: 'healthy', label: 'Healthy weight', range: '18.5–24.9' },
  { key: 'overweight', label: 'Overweight', range: '25–29.9' },
  { key: 'obesity', label: 'Obesity', range: '30 and above' },
];
const initialMeasurements = { kg: '', cm: '', lb: '', feet: '', inches: '' };

export default function BmiCalculatorPage() {
  const [units, setUnits] = useState('metric');
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [adult, setAdult] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailPreview, setEmailPreview] = useState('');
  const [previewRequest, setPreviewRequest] = useState(0);
  const resultHeading = useRef(null);
  const emailInput = useRef(null);
  const emailPreviewPanel = useRef(null);
  const guidance = bmiGuidance(result?.category.key);

  useEffect(() => {
    if (!result) return;
    const frame = requestAnimationFrame(() => {
      resultHeading.current?.focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 700px)').matches) scrollToSection(resultHeading.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [result]);

  useEffect(() => {
    if (!emailPreview) return;
    const frame = requestAnimationFrame(() => {
      emailPreviewPanel.current?.focus({ preventScroll: true });
      scrollToSection(emailPreviewPanel.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [emailPreview, previewRequest]);

  function clearResult() {
    setResult(null);
    setError('');
    setEmailError('');
    setEmailPreview('');
  }
  function updateMeasurement(event) {
    setMeasurements(previous => ({ ...previous, [event.target.name]: event.target.value }));
    clearResult();
  }
  function chooseUnits(nextUnits) {
    if (nextUnits === units) return;
    setUnits(nextUnits);
    clearResult();
  }
  function calculate(event) {
    event.preventDefault();
    setEmailPreview('');
    setEmailError('');
    try {
      const metric = units === 'metric';
      if (metric && (!measurements.kg.trim() || !measurements.cm.trim())) throw new Error('Enter your height and weight to calculate your BMI.');
      if (!metric && (!measurements.lb.trim() || !measurements.feet.trim())) throw new Error('Enter your weight in pounds and your height in feet and inches.');
      if (!metric && (!Number.isInteger(Number(measurements.feet)) || !Number.isInteger(Number(measurements.inches || 0)) || Number(measurements.inches || 0) < 0 || Number(measurements.inches || 0) > 11)) throw new Error('Use whole feet and inches, with inches between 0 and 11.');
      const weightKg = metric ? Number(measurements.kg) : Number(measurements.lb) * 0.45359237;
      const heightCm = metric ? Number(measurements.cm) : (Number(measurements.feet) * 12 + Number(measurements.inches || 0)) * 2.54;
      const report = calculateBmi({ weightKg, heightCm, adult });
      setResult(report);
      setError('');
    } catch (failure) {
      setResult(null);
      setError(failure.message || 'Check your height and weight and try again.');
    }
  }
  function previewEmail(event) {
    event.preventDefault();
    if (!result) return;
    if (!email.trim() || !emailInput.current?.checkValidity()) {
      setEmailError('Enter a valid email address to preview your report.');
      setEmailPreview('');
      emailInput.current?.focus();
      return;
    }
    setEmailError('');
    setEmailPreview(email.trim());
    setPreviewRequest(previous => previous + 1);
  }

  return <div className="bmi-page wrap" data-clarity-mask="true">
    <header className="bmi-intro">
      <h1 className="bmi-eyebrow">The Tru Fit BMI calculator</h1>
    </header>

    <div className="bmi-workspace">
      <section className="bmi-calculator" aria-labelledby="bmi-calculator-title">
        <div className="bmi-section-top"><h2 id="bmi-calculator-title">Your measurements.</h2><span>Adults 20+</span></div>
        <div className="bmi-unit-switch" role="group" aria-label="Measurement units"><button type="button" aria-pressed={units === 'metric'} onClick={() => chooseUnits('metric')}>Metric <span>kg / cm</span></button><button type="button" aria-pressed={units === 'imperial'} onClick={() => chooseUnits('imperial')}>Imperial <span>lb / ft</span></button></div>
        <form onSubmit={calculate} noValidate>
          {units === 'metric' ? <div className="bmi-fields"><label htmlFor="bmi-weight-kg">Weight <span className="bmi-input-wrap"><input id="bmi-weight-kg" name="kg" type="number" min="20" max="500" step="any" inputMode="decimal" value={measurements.kg} onChange={updateMeasurement} placeholder="70" required aria-describedby="bmi-measurement-hint"/><span aria-hidden="true">kg</span></span></label><label htmlFor="bmi-height-cm">Height <span className="bmi-input-wrap"><input id="bmi-height-cm" name="cm" type="number" min="100" max="250" step="any" inputMode="decimal" value={measurements.cm} onChange={updateMeasurement} placeholder="170" required aria-describedby="bmi-measurement-hint"/><span aria-hidden="true">cm</span></span></label></div> : <><label className="bmi-field" htmlFor="bmi-weight-lb">Weight <span className="bmi-input-wrap"><input id="bmi-weight-lb" name="lb" type="number" min="44.092" max="1102.312" step="any" inputMode="decimal" value={measurements.lb} onChange={updateMeasurement} placeholder="154" required aria-describedby="bmi-measurement-hint"/><span aria-hidden="true">lb</span></span></label><div className="bmi-fields bmi-height-fields"><label htmlFor="bmi-height-feet">Height in feet <span className="bmi-input-wrap"><input id="bmi-height-feet" name="feet" type="number" min="3" max="8" step="1" inputMode="numeric" value={measurements.feet} onChange={updateMeasurement} placeholder="5" required/><span aria-hidden="true">ft</span></span></label><label htmlFor="bmi-height-inches">Additional inches <span className="bmi-input-wrap"><input id="bmi-height-inches" name="inches" type="number" min="0" max="11" step="1" inputMode="numeric" value={measurements.inches} onChange={updateMeasurement} placeholder="0"/><span aria-hidden="true">in</span></span></label></div></>}
          <p id="bmi-measurement-hint" className="bmi-field-hint">20–500 kg · 100–250 cm, or imperial equivalents.</p>
          <label className="bmi-adult-check"><input type="checkbox" checked={adult} onChange={event => { setAdult(event.target.checked); clearResult(); }}/><span>I am 20 or older.</span></label>
          {error && <p className="bmi-error" role="alert">{error}</p>}
          <button className="bmi-primary-button" type="submit">Calculate my BMI</button>
          <p className="bmi-local-note"><span aria-hidden="true">◦</span> Just for you. Nothing is saved or sent.</p>
        </form>
      </section>

      <section className={`bmi-report${result ? ' has-result' : ''}`} aria-labelledby="bmi-report-title" aria-live="polite">
        <h2 id="bmi-report-title" ref={resultHeading} tabIndex={-1}>Your body mass index</h2>
        <div className={`bmi-result-orbit${result ? ' is-ready' : ''}`}>
          <div className="bmi-orbit-ring" aria-hidden="true"/>
          <div className="bmi-result-core"><span className="bmi-result-number">{result ? result.bmi.toFixed(1) : '—'}</span><span className="bmi-result-unit">{result ? 'kg/m²' : 'Ready when you are'}</span></div>
        </div>
        {result ? <>
          <span className="bmi-category-pill">{result.category.label}</span>
          <p className="bmi-measurement-summary">{Number(result.heightCm.toFixed(1))} cm <span>·</span> {Number(result.weightKg.toFixed(1))} kg</p>
          <div className="bmi-category-scale" aria-label="Standard adult BMI categories">{categories.map(category => <div key={category.key} className={category.key === result.category.key ? 'is-current' : ''}><span>{category.label}</span><strong>{category.range}</strong>{category.key === result.category.key && <small className="bmi-sr-only">Your category</small>}</div>)}</div>
        </> : <p className="bmi-report-empty">A small check.<br/>One part of the bigger picture.</p>}
        <p className="bmi-screening-note">A screening measure, not a diagnosis.</p>
      </section>

      {result && <section className="bmi-email-section" aria-labelledby="bmi-email-title">
        <div className="bmi-email-heading"><span className="bmi-mail-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg></span><div><h2 id="bmi-email-title">Preview your email report.</h2><p>Optional. No email is sent.</p></div></div>
        <div className="bmi-email-content"><form className="bmi-email-form" onSubmit={previewEmail} noValidate><label htmlFor="bmi-report-email">Email address</label><div className="bmi-email-controls"><input ref={emailInput} id="bmi-report-email" type="email" autoComplete="email" maxLength="254" value={email} onChange={event => { setEmail(event.target.value); setEmailError(''); setEmailPreview(''); }} placeholder="you@example.com" aria-invalid={Boolean(emailError)} aria-describedby={emailError ? 'bmi-email-error' : 'bmi-email-privacy'} required/><button type="submit" className="bmi-primary-button">Preview email report</button></div><p id="bmi-email-privacy" className="bmi-local-note">Your address stays here. No storage. No subscription.</p>{emailError && <p id="bmi-email-error" className="bmi-error" role="alert">{emailError}</p>}</form>
          {emailPreview && <article ref={emailPreviewPanel} tabIndex={-1} className="bmi-email-preview" aria-label="Email report preview" aria-live="polite"><div className="bmi-preview-top"><span>Email preview · Not sent</span><button type="button" onClick={() => { setEmailPreview(''); emailInput.current?.focus(); }}>Edit email</button></div><dl className="bmi-email-envelope"><div><dt>To</dt><dd>{emailPreview}</dd></div><div><dt>Subject</dt><dd>Your Tru Fit BMI report</dd></div></dl><div className="bmi-email-body"><p className="bmi-eyebrow">Your Tru Fit snapshot</p><h3>Your BMI is {result.bmi.toFixed(1)}.</h3><p>Adult BMI category: <strong>{result.category.label}</strong></p><p>Height: {Number(result.heightCm.toFixed(1))} cm · Weight: {Number(result.weightKg.toFixed(1))} kg</p><p>BMI is a screening measure, not a diagnosis. It does not distinguish muscle from body fat. This report uses the standard categories for adults aged 20 and over.</p><p>Tru Fit · A little better. Every day.</p></div></article>}
        </div>
      </section>}
    </div>

    <footer className="bmi-next-steps" aria-labelledby="bmi-next-steps-title">
      <div className="bmi-next-guidance">
        <p className="bmi-eyebrow">{result ? 'A few basic next steps' : 'Your next step'}</p>
        <h2 id="bmi-next-steps-title">{result ? guidance.title : 'Support that starts with your goal.'}</h2>
        {result ? <ul className="bmi-next-tips">{guidance.tips.map(tip => <li key={tip}>{tip}</li>)}</ul> : <p className="bmi-next-intro">Calculate your BMI to see a few general starting points, or explore a coach for the goal you have in mind.</p>}
        {result && guidance.source && <a className="bmi-guidance-source" href={guidance.source.url} target="_blank" rel="noreferrer">{guidance.source.title}<span className="bmi-sr-only"> (opens in a new tab)</span></a>}
      </div>
      <div className="bmi-next-coach">
        <h3>Choose support for your goal</h3>
        <p>{result ? guidance.coachFocus : 'Find a coach who fits your routine and preferences.'}</p>
        <Link className="bmi-primary-button" to={result ? guidance.link : '/coaches?focus=all'}>{result ? 'Explore matching coaches' : 'Explore our coaches'}</Link>
        {result && <Link className="bmi-other-goal" to="/coaches?focus=all">Choose a different goal</Link>}
      </div>
      {result && <p className="bmi-next-note">Based on your BMI category, not a medical assessment. Choose a goal that suits you.</p>}
    </footer>
    <div className="bmi-footnote"><details className="bmi-context"><summary>What does BMI tell me?</summary><div><p>BMI compares your weight with your height. It does not distinguish muscle from body fat and is only one part of understanding your health. A healthcare professional can help interpret your result.</p><a href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html" target="_blank" rel="noreferrer">CDC adult BMI guidance<span className="bmi-sr-only"> (opens in a new tab)</span></a></div></details></div>
  </div>;
}
