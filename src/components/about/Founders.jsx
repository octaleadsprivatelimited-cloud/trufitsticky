import React from "react";
import { motion } from "framer-motion";
import FounderOne from "../../assets/founder-one.webp";
import FounderTwo from "../../assets/founder-two.webp";

const Founders = () => {
  // const [activeCard, setActiveCard] = useState(null);

  // const toggleCard = (id) => {
  //   setActiveCard(activeCard === id ? null : id);
  // };

  // const cardVariant = {
  //   hidden: { y: "100%", opacity: 0 },
  //   visible: { y: "0%", opacity: 1 },
  //   exit: { y: "100%", opacity: 0 }
  // };

  return (
    <div className="fou__section">
      <div className="fou__container">
        <div className="fou__content">
          <div className="fou__head">
            <h2>Meet our Founders</h2>
          </div>

          <div className="fou__main">
            {/* Founder 1 */}
            <motion.div
              className="fou__card-sec"
              initial={{ scale: 0.85, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.4 }}
              onClick={() => window.open("https://www.linkedin.com/in/vishwa-bharath-6aa52bb4/", "_blank")}
              style={{ cursor: "pointer" }}
            >
              <div className="fou__card">
                <img
                  src={FounderOne}
                  alt="Vishwa Bharath"
                  className="fou__card-img"
                />
                {/* <div
                  className="fou__card-arrow">
                  <img src={Arrow} alt="Arrow" />
                </div> */}

                {/* <AnimatePresence>
                  {activeCard === "vishwa" && (
                    <motion.div
                      className="fou__card-det"
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="fou__card-det-head">
                        <img src={CloseCard} alt="Close card icon" onClick={() => setActiveCard(null)} />
                      </div>
                      <div className="fou__card-det-main">
                        <p className="fou__card-det-title">About <span>Vishwa Bharath</span></p>
                        <p className="fou__card-det-desc">Former corporate executive turned fitness entrepreneur and celebrity coach. 8+ years helping professionals balance demanding careers with health goals.</p>
                      </div>
                      <div className="fou__card-det-red">
                        <p>Know more</p>
                        <img src={DetArrow} alt="Know more arrow icon" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence> */}
              </div>
              <h3 className="fou__card-title">Vishwa Bharath</h3>
              <p className="fou__card-tag">Co-founder</p>
            </motion.div>

            {/* Founder 2 */}
            <motion.div
              className="fou__card-sec"
              initial={{ scale: 0.85, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.4 }}
              onClick={() => window.open("https://www.linkedin.com/in/pratikthakkar7/", "_blank")}
              style={{ cursor: "pointer" }}
            >
              <div className="fou__card">
                <img
                  src={FounderTwo}
                  alt="Pratik Thakkar"
                  className="fou__card-img"
                />
                {/* <div
                  className="fou__card-arrow">
                  <img src={Arrow} alt="Arrow" />
                </div> */}

                {/* <AnimatePresence>
                  {activeCard === "pratik" && (
                    <motion.div
                      className="fou__card-det"
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="fou__card-det-head">
                        <img src={CloseCard} alt="Close card icon" onClick={() => setActiveCard(null)} />
                      </div>
                      <div className="fou__card-det-main">
                        <p className="fou__card-det-title">About <span>Pratik Thakkar</span></p>
                        <p className="fou__card-det-desc">MBA from UVA Darden School of Business. Previously built fitness startups and led product teams at Fortune 500 tech companies. Combines business acumen with deep fitness industry expertise.</p>
                      </div>
                      <div className="fou__card-det-red">
                        <p>Know more</p>
                        <img src={DetArrow} alt="Know more arrow icon" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence> */}
              </div>
              <h3 className="fou__card-title">Pratik Thakkar</h3>
              <p className="fou__card-tag">Co-founder</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Founders;
