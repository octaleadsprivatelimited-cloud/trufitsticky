import React from "react";
import { motion } from "framer-motion";
import ImgOne from "../../assets/about-one.webp";
import ImgTwo from "../../assets/about-two.webp";
import ImgThree from "../../assets/about-three.webp";
import ImgFour from "../../assets/about-four.webp";
import ImgFive from "../../assets/about-five.webp";
import ImgSix from "../../assets/about-six.webp";
import ImgSeven from "../../assets/about-seven.webp";
import ImgEight from "../../assets/about-eight.webp";
import { useBreakpoint } from "../../hooks/useBreakpoint";


const About = () => {
  const { isMobile, isLargeDesktop } = useBreakpoint();

  return (
    <div className="about__section">
      <div className="about__container">
        <div className="about__content">
          <div className="about__head">
            <motion.h1
              className="about__head-title"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              About <span>Tru Fit</span>
            </motion.h1>
            <motion.p
              className="about__head-desc"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              Your journey to better health shouldn't feel like another task on your endless to-do list. It shouldn't involve cookie-cutter plans or coaches who treat you like just another number. At Tru Fit, we know you're juggling demanding work schedules, family commitments, and the daily stress of modern life. You've probably tried gym memberships that went unused, followed YouTube workouts that left you confused, or started diet plans that were impossible to stick with.
            </motion.p>
          </div>

          <div className="about__main">
            <div className="about__main-container">
              {/* Image 1 */}
              <div className="about__img-container">
                  <motion.img
                    src={ImgOne}
                    alt="About Image"
                    className="about__img img-one"
                    initial={isMobile ? { scale: 0.85, opacity: 0 } : { opacity: 0 }}
                    whileInView={isMobile ? { scale: 1, opacity: 1 } : { opacity: 1, scale: .85 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                  />
              </div>

              {/* Image 2 - moves down on tablet+ */}
              <div className="about__img-container">
                  <motion.img
                    src={ImgTwo}
                    alt="About Image"
                    className="about__img img-two"
                    initial={
                      isMobile
                        ? { scale: 0.85, opacity: 0 }
                        : { y: 0, opacity: 0 }
                    }
                    whileInView={
                      isMobile
                        ? { scale: 1, opacity: 1 }
                        : {
                      y: isLargeDesktop ? 58 : 30, // more movement on large screens
                      opacity: 1,
                      scale: isLargeDesktop ? 1.2 : 1.15,
                      zIndex: 1
                          }
                    }
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                  />
              </div>

              {/* Image 3 */}
              <div className="about__img-container">
                  <motion.img
                    src={ImgThree}
                    alt="About Image"
                    className="about__img img-three"
                    initial={isMobile ? { scale: 0.85, opacity: 0 } : { opacity: 0 }}
                    whileInView={isMobile ? { scale: 1, opacity: 1 } : { opacity: 1, scale: .85 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                  />
              </div>

              {/* Image 4 - moves right on tablet+ */}
              <div className="about__img-container">
                  <motion.img
                    src={ImgFour}
                    alt="About Image"
                    className="about__img img-four"
                    initial={
                      isMobile
                        ? { scale: 0.85, opacity: 0 }
                        : { x: 0, opacity: 0 }
                    }
                    whileInView={
                      isMobile
                        ? { scale: 1, opacity: 1 }
                        : {
                      x: isLargeDesktop ? 80 : 30,
                      opacity: 1,
                      scale: isLargeDesktop ? 1.2 : 1.15,
                      zIndex: 1
                          }
                    }
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                  />
              </div>

              {/* Image 5 */}
              <div className="about__img-container">
                  <motion.img
                    src={ImgFive}
                    alt="About Image"
                    className="about__img img-five"
                    initial={isMobile ? { scale: 0.85, opacity: 0 } : { opacity: 0 }}
                    whileInView={isMobile ? { scale: 1, opacity: 1 } : { opacity: 1, scale: .85 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                  />
              </div>

              {/* Image 6 - moves left on tablet+ */}
              <div className="about__img-container">
                  <motion.img
                    src={ImgSix}
                    alt="About Image"
                    className="about__img img-six"
                    initial={
                      isMobile
                        ? { scale: 0.85, opacity: 0 }
                        : { x: 0, opacity: 0 }
                    }
                    whileInView={
                      isMobile
                        ? { scale: 1, opacity: 1 }
                        : {
                      x: isLargeDesktop ? -80 : -30,
                      opacity: 1,
                      scale: isLargeDesktop ? 1.2 : 1.15,
                      zIndex: 1
                          }
                    }
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                  />
              </div>

              {/* Image 7 */}
              <div className="about__img-container">
                  <motion.img
                    src={ImgSeven}
                    alt="About Image"
                    className="about__img img-seven"
                    initial={isMobile ? { scale: 0.85, opacity: 0 } : { opacity: 0 }}
                    whileInView={isMobile ? { scale: 1, opacity: 1 } : { opacity: 1, scale: .85 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                  />
              </div>

              {/* Image 8 - moves up on tablet+ */}
              <div className="about__img-container">
                  <motion.img
                    src={ImgEight}
                    alt="About Image"
                    className="about__img img-eight"
                    initial={
                      isMobile
                        ? { scale: 0.85, opacity: 0 }
                        : { y: 0, opacity: 0 }
                    }
                    whileInView={
                      isMobile
                        ? { scale: 1, opacity: 1 }
                        : {
                      y: isLargeDesktop ? -80 : -30,
                      opacity: 1,
                      scale: isLargeDesktop ? 1.2 : 1.15,
                      zIndex: 1
                          }
                    }
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                  />
              </div>

              {/* Image 9 */}
              <div className="about__img-container">
                  <motion.img
                    src={ImgFive}
                    alt="About Image"
                    className="about__img img-eight"
                    initial={isMobile ? { scale: 0.85, opacity: 0 } : { opacity: 0 }}
                    whileInView={isMobile ? { scale: 1, opacity: 1 } : { opacity: 1, scale: .85 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
