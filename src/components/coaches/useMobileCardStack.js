import { useEffect, useRef } from 'react';

export default function useMobileCardStack(enabled) {
  const root = useRef(null);
  useEffect(() => {
    if (!enabled || !root.current) return;
    const cards = [...root.current.querySelectorAll('.coaching-plan-panel,.coaching-reviews,.coaching-guide,.profile-faq')];
    const mobile = window.matchMedia('(max-width: 650px)');
    const update = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      cards.forEach((card, index) => {
        // Tall or expanded cards must scroll fully above the fixed payment bar.
        const top = Math.min(76 + index * 10, height - card.offsetHeight - 100);
        if (mobile.matches) card.style.setProperty('--stack-top', `${top}px`);
        else card.style.removeProperty('--stack-top');
      });
    };
    const observer = new ResizeObserver(update);
    cards.forEach(card => observer.observe(card));
    mobile.addEventListener('change', update);
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    update();
    return () => {
      observer.disconnect();
      mobile.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      cards.forEach(card => card.style.removeProperty('--stack-top'));
    };
  }, [enabled]);
  return root;
}
