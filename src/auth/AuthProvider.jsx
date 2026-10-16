import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { demoAccount } from '../portal/data.mjs';

const key = 'trufit_demo_identity_v1';
function readIdentity() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(key));
    if (saved?.isPreview === true && ['google', 'apple'].includes(saved.provider)) return { ...demoAccount, provider: saved.provider, isPreview: true };
  } catch { /* A blocked or expired browser store starts signed out. */ }
  return null;
}
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readIdentity);
  function signInPreview(provider) {
    if (!['google', 'apple'].includes(provider)) return;
    const identity = { provider, isPreview: true };
    try { sessionStorage.setItem(key, JSON.stringify(identity)); } catch { /* In-memory preview still works. */ }
    setUser({ ...demoAccount, ...identity });
  }
  function signOut() {
    try { sessionStorage.removeItem(key); sessionStorage.removeItem('trufit_demo_booking_v1'); sessionStorage.removeItem('trufit_demo_fitness_profile_v1'); sessionStorage.removeItem('trufit_demo_kit_v1'); } catch { /* In-memory sign-out still works. */ }
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, signInPreview, signOut }}>{children}</AuthContext.Provider>;
}
