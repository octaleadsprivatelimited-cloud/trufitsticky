import { useEffect, useRef } from 'react';
import './mobileSectionSnap.css';

const cardSelector = '.plan-sculpted-card, .cpx-plan-pill--consultation, #coach-overview, #coach-reviews, #coach-inclusions, #coach-about, #coach-faq, .package-heading';

// Animate on entry rather than hiding pending content: failed/disabled JS never
// leaves a section invisible, and scrolling remains controlled by the visitor.
export default function useMobileCardMotion({ bookingOpen = false } = {}) {
  const rootRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver || !window.MutationObserver) return undefined;
    const mobile = window.matchMedia('(max-width: 700px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dispose = () => {};
    const configure = () => {
      dispose();
      if (!mobile.matches || reducedMotion.matches) return;
      const observed = new Set();
      const played = new WeakSet();
      const animations = new Map();
      const observer = new IntersectionObserver(entries => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting || played.has(target)) continue;
          played.add(target);
          observer.unobserve(target);
          if (target.contains(document.activeElement) || !target.animate) continue;
          const animation = target.animate([
            { opacity: .65, transform: 'translateY(20px) scale(.98)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' },
          ], { duration: 300, easing: 'cubic-bezier(.2,.75,.25,1)' });
          animations.set(target, animation);
          animation.onfinish = () => animations.delete(target);
        }
      }, { threshold: .12, rootMargin: '0px 0px -12px 0px' });
      const register = () => {
        for (const target of observed) {
          if (!root.contains(target)) {
            observer.unobserve(target);
            animations.get(target)?.cancel();
            animations.delete(target);
            observed.delete(target);
          }
        }
        root.querySelectorAll(cardSelector).forEach(target => {
          if (observed.has(target)) return;
          observed.add(target);
          observer.observe(target);
        });
      };
      const focus = event => {
        for (const [target, animation] of animations) {
          if (target.contains(event.target)) {
            animation.cancel();
            animations.delete(target);
          }
        }
      };
      const mutation = new MutationObserver(register);
      register();
      mutation.observe(root, { childList: true, subtree: true });
      root.addEventListener('focusin', focus);
      dispose = () => {
        observer.disconnect();
        mutation.disconnect();
        animations.forEach(animation => animation.cancel());
        root.removeEventListener('focusin', focus);
      };
    };
    configure();
    mobile.addEventListener('change', configure);
    reducedMotion.addEventListener('change', configure);
    return () => {
      dispose();
      mobile.removeEventListener('change', configure);
      reducedMotion.removeEventListener('change', configure);
    };
  }, []);
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 700px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const page = document.documentElement;
    const update = () => page.classList.toggle('coach-section-snap', mobile.matches && !reducedMotion.matches && !bookingOpen);
    update();
    mobile.addEventListener('change', update);
    reducedMotion.addEventListener('change', update);
    return () => {
      page.classList.remove('coach-section-snap');
      mobile.removeEventListener('change', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, [bookingOpen]);
  return rootRef;
}
