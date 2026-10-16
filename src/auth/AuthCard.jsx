import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { demoAccount } from '../portal/data.mjs';
import '../styles/member-access.css';

function ProviderIcon({ provider }) {
  return provider === 'google' ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.36ZM12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.06.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22ZM6.41 13.92a6 6 0 0 1 0-3.84V7.49H3.07a10 10 0 0 0 0 9.02l3.34-2.59ZM12 5.96c1.47 0 2.79.51 3.82 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59A5.99 5.99 0 0 1 12 5.96Z"/></svg> : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 12.8c0-2 1.6-3 1.7-3.1-1-1.5-2.6-1.7-3.2-1.7-1.4-.2-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8C6.6 8 4.5 9.8 4.5 13c0 1.9.7 3.8 1.6 5.1.8 1.2 1.7 2.6 3 2.5 1.2-.1 1.7-.8 3.1-.8s1.8.8 3.1.7c1.4 0 2.2-1.2 3-2.4.9-1.3 1.2-2.5 1.2-2.6-.1 0-2.9-1.1-2.9-2.7ZM14.4 6.5c.7-.9 1.2-2 1.1-3.2-1.1.1-2.4.8-3.1 1.7-.7.8-1.3 2-1.1 3.1 1.2.1 2.4-.6 3.1-1.6Z"/></svg>;
}
export default function AuthCard({ booking = false }) {
  const [mode, setMode] = useState('signin');
  const [provider, setProvider] = useState(null);
  const { signInPreview } = useAuth();
  const titleRef = useRef(null);
  const Heading = booking ? 'h2' : 'h1';
  useEffect(() => { if (provider) titleRef.current?.focus(); }, [provider]);
  return <div className="member-auth-card" data-clarity-mask="true">
    <span className="member-access-badge">UI preview</span>
    {provider ? <>
      <span className="member-provider-mark"><ProviderIcon provider={provider}/></span>
      <Heading id="member-auth-title" ref={titleRef} tabIndex={-1}>{provider === 'google' ? 'Google' : 'Apple'} sign-in preview</Heading>
      <p>Explore with {demoAccount.name}’s sample account. This preview doesn’t connect to {provider === 'google' ? 'Google' : 'Apple'} or verify your identity.</p>
      <button className="member-primary" onClick={() => signInPreview(provider)}>Continue with demo account</button>
      <button className="member-text-button" onClick={() => setProvider(null)}>Choose another sign-in option</button>
    </> : <>
      <div className="member-auth-tabs" aria-label="Account access"><button aria-pressed={mode === 'signin'} onClick={() => setMode('signin')}>Sign in</button><button aria-pressed={mode === 'signup'} onClick={() => setMode('signup')}>Sign up</button></div>
      <Heading id="member-auth-title" tabIndex={-1}>{mode === 'signin' ? 'Welcome back.' : 'Your next chapter starts here.'}</Heading>
      <p>{booking ? 'Sign in or create your account to continue. Your coach and plan are saved right here.' : 'Your coach, sessions, and progress. All in your Tru Fit space.'}</p>
      <div className="member-provider-buttons">{['google', 'apple'].map(item => <button key={item} onClick={() => setProvider(item)}><ProviderIcon provider={item}/>Continue with {item === 'google' ? 'Google' : 'Apple'}</button>)}</div>
      <p className="member-auth-note">The same Google or Apple account will be used for sign-in and sign-up. No password to remember.</p>
      <p className="member-auth-demo-note">Demo only. No external account is connected.</p>
      <p className="member-auth-terms">By continuing, you agree to our <Link to="/terms-conditions">Terms</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.</p>
    </>}
  </div>;
}

export function AuthDialog({ onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current, previous = document.activeElement, overflow = document.body.style.overflow;
    element.showModal(); document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog className="member-auth-dialog" ref={dialog} aria-labelledby="member-auth-title" onCancel={onClose} data-lenis-prevent><button className="member-dialog-close" onClick={onClose} aria-label="Close sign-in">×</button><AuthCard booking/></dialog>;
}
