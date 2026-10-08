import { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import DifferentOne from "../../assets/different-one.webp";
import DifferentTwo from "../../assets/different-two.webp";
import DifferentThree from "../../assets/different-three.webp";
import DifferentFour from "../../assets/different-four.webp";


const Different = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const features = [
    {
      image: DifferentOne,
      leftText: `We start where you are, not where you "should" be.`,
      rightText:
        "Whether you haven't exercised in years or you're looking to break through a plateau, our coaches meet you exactly where you are in your journey. No judgment, no unrealistic expectations—just honest, practical guidance."
    },
    {
      image: DifferentTwo,
      leftText: "Your coach actually knows you. ",
      rightText:
        "Unlike platforms where coaches juggle hundreds of clients, our coaches work with manageable client loads. This means they remember your preferences, understand your challenges, and celebrate your wins—big and small."
    },
    {
      image: DifferentThree,
      leftText: "We build plans that bend, not break.",
      rightText:
        "Missed a workout because of a work deadline? No problem. Traveling for business? We'll adapt. Your plan should work with your life, not against it."
    },
    {
      image: DifferentFour,
      leftText: "Progress, not perfection.",
      rightText:
        "We measure success in energy levels, better sleep, increased confidence, and how you feel in your own skin—not just the number on the scale."
    }
  ];

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const newIndex = Math.floor(latest * features.length);
      setCurrentIndex(Math.min(newIndex, features.length - 1));
    });

    return () => unsubscribe();
  }, [scrollYProgress, features.length]);

  return (
    <div ref={containerRef} className="different-container">
      <div className="different-sticky">
        <div className="different-inner">

          <h2 className="different-heading">
            What makes us <span>Different</span>
          </h2>
          <div className="different-grid">
            {/* Left Text */}
            <div className="different-left">
              <motion.h3
                key={currentIndex}
                className="different-left-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {features[currentIndex]?.leftText}
              </motion.h3>
            </div>

            {/* Image */}
            <div className="different-center">
              <div className="image-wrapper">
                <div className="image-bg"></div>
                <motion.div
                  key={currentIndex}
                  className="image-container"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={features[currentIndex]?.image}
                    alt={`Feature ${currentIndex + 1}`}
                    className="image"
                  />
                </motion.div>
              </div>
            </div>

            {/* Right Text */}
            <div className="different-right">
              <motion.p
                key={currentIndex}
                className="different-right-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {features[currentIndex]?.rightText}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Different;
