import React, { useRef, useEffect, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";
import "./aboutPage.css";

const Counter = ({ from = 0, to, duration = 2, decimals = 0, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4, once: true });

  const mv = useMotionValue(from);
  const [display, setDisplay] = useState(from);

  // Keep React text in sync with the MotionValue
  useEffect(() => {
    const unsub = mv.on("change", (latest) => {
      // format decimals safely
      const n = Number(latest);
      setDisplay(decimals > 0 ? Number(n.toFixed(decimals)) : Math.round(n));
    });
    return () => unsub();
  }, [mv, decimals]);

  // Start animation when the number is in view
  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (!inView) return;
    if (prefersReduced) {
      mv.set(to);
      return;
    }
    const controls = animate(mv, to, {
      duration,
      ease: [0.22, 1, 0.36, 1], // smooth easeOut
    });
    return () => controls.stop();
  }, [inView, mv, to, duration]);

  return (
    <p ref={ref} className="imp__card-text">
      {display}
      {suffix}
    </p>
  );
};

const Impact = () => {
  return (
    <div className="imp__section">
      <div className="imp__container">
        <div className="imp__head">
          <h2>Our Impact</h2>
        </div>

        <div className="imp__content">
          <div className="imp__card">
            <Counter to={5000} suffix="+" />
            <p className="imp__card-tag">Clients transformed across our programs</p>
          </div>

          <div className="imp__card">
            <Counter to={97} suffix="%" />
            <p className="imp__card-tag">Client satisfaction rate</p>
          </div>

          <div className="imp__card">
            <Counter to={91} suffix="%" />
            <p className="imp__card-tag">Clients who achieve their primary goal within 12 weeks</p>
          </div>

          <div className="imp__card">
            <Counter to={4.9} decimals={1} suffix="/5" />
            <p className="imp__card-tag">Average coach rating from clients</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;
