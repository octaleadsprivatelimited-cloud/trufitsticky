import { useEffect, useRef } from 'react';
import { scrollToSection } from '../../scroll/smoothScroll';
import './inlineBooking.css';

export default function InlineBooking({ children }) {
  const panel = useRef(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const heading = panel.current?.querySelector('h2');
      (heading || panel.current)?.focus({ preventScroll:true });
      scrollToSection(panel.current);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <section className="booking-inline" ref={panel} tabIndex={-1} aria-label="Booking details">{children}</section>;
}
