import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Progressive enhancement: content stays visible if motion is unavailable.
export default function PageMotion() {
  const { pathname } = useLocation();
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !window.IntersectionObserver) return;
    const seen = new WeakSet();
    const animations = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (preference.matches || !entry.target.animate) return;
        const animation = entry.target.animate([
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.08 });
    const discover = () => document.querySelectorAll('[data-reveal]').forEach(element => {
      if (!seen.has(element)) { seen.add(element); observer.observe(element); }
    });
    const stopMotion = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
    const mutations = new MutationObserver(discover);
    mutations.observe(document.getElementById('main-content'), { childList: true, subtree: true });
    preference.addEventListener('change', stopMotion);
    discover();
    return () => { observer.disconnect(); mutations.disconnect(); animations.forEach(animation => animation.cancel()); preference.removeEventListener('change', stopMotion); };
  }, [pathname]);
  return null;
}
