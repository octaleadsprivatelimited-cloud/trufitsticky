import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import WeOne from "../../assets/we-one.svg";
import WeTwo from "../../assets/we-two.svg";
import WeThree from "../../assets/we-three.svg";
import WeFour from "../../assets/we-four.svg";

const cardData = [
  {
    title: "Choose Your Coach",
    desc: "Browse our team of certified trainers and pick someone who resonates with you. Have a paid consultation to make sure it's the right fit before committing.",
    icon: WeOne,
  },
  {
    title: "Get Your Personal Plan",
    desc: "Your coach creates a program designed around your goals, schedule, and access to equipment. No two plans are exactly alike because no two people are exactly alike.",
    icon: WeTwo,
  },
  {
    title: "Stay Connected",
    desc: "Weekly check-ins keep you on track, while 24/7 chat support (during working hours) means you're never stuck wondering what to do next.",
    icon: WeThree,
  },
  {
    title: "See Real Results",
    desc: "Most clients start noticing changes by week 4-6, but the real transformation happens over months as healthy habits become second nature.",
    icon: WeFour,
  },
];

const WeDoIt = () => {
  const container = useRef(null);

  // global scroll tracking for stacking effect
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // ✅ Fixed number of cards → safe to define transforms explicitly
  const scale0 = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const y0 = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const scale1 = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const scale2 = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const scale3 = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const transforms = [
    { scale: scale0, y: y0, zIndex: 1 },
    { scale: scale1, y: y1, zIndex: 2 },
    { scale: scale2, y: y2, zIndex: 3 },
    { scale: scale3, y: y3, zIndex: 4 },
  ];

  return (
    <div ref={container} className="we__section">
      <div className="we__container">
        <div className="we__content">
          <div className="we__head">
            <h2>
              How <span>We</span> do it
            </h2>
          </div>

          <div className="we__card-sec">
            {cardData.map((card, i) => (
              <motion.div
                key={i}
                className="we__card"
                style={{
                  scale: transforms[i].scale,
                  y: transforms[i].y,
                  zIndex: transforms[i].zIndex,
                }}
              >
                <div className="we__card-head">
                  <img src={card.icon} alt={card.title} />
                  <h3>{card.title}</h3>
                </div>
                <p className="we__card-desc">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeDoIt;
