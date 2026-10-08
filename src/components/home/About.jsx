import { motion } from "framer-motion";
import "../../index.css"
import Arrow from "../../assets/arrow.svg"
import Empower from "../../assets/empower.svg"
import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();

    const redirectToAbout = () => {
        navigate("/about")
    }

  return (
    <>
        <div className="bey__section">
            <div className="bey__container">
                <div className="bey__content">
                    <motion.div
                        className="bey__text-sec"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <h2 className="bey__title">beyond the plan</h2>
                    </motion.div>
                    <motion.div
                        className="bey__text-sec"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <p className="bey__text">Tru Fit isn’t just a fitness program, it’s a support system. Your coach helps with workouts, nutrition, and the ups and downs that come with real life. We’re here to make the plan work for you, not the other way around.</p>
                    </motion.div>
                </div>
                <div className="redirect__btn bey__btn" onClick={redirectToAbout}>
                    <p>About Tru Fit</p>
                    <div className="redirect__btn-bg">
                        <img src={Arrow} alt="Arrow" />
                    </div>
                </div>
            </div>
        </div>
        <div className="emp__section">
            <div className="emp__container">
                <div className="emp__content">
                    <div className="emp__head">
                        <h2 className="emp__head-title">Tru Fit Empowers You</h2>
                        <p className="emp__head-tag">Structure, support, and simple routines. Everything you need to keep moving forward, even on the hard days.</p>
                    </div>
                    <div className="emp__main">
                        <div className="emp__card">
                            <div className="emp__card-head">
                                <img src={Empower} alt="Icon" />
                                <h3>Friendly Coach</h3>
                            </div>
                            <p className="emp__card-text">Coaches who get you. Encouraging, consistent, and here to keep things doable, not overwhelming.</p>
                            {/* <p className="emp__card-link" 
                                onClick={() => {
                                    document.getElementById("contact-form")?.scrollIntoView({ 
                                        behavior: "smooth" 
                                    });
                                }}>
                                Reach out
                            </p> */}
                        </div>
                        <div className="emp__card">
                            <div className="emp__card-head">
                                <img src={Empower} alt="Icon" />
                                <h3>Personal Training</h3>
                            </div>
                            <p className="emp__card-text">A plan that’s built around you. Workouts, nutrition, and regular check-ins, all personalized to fit your life.</p>
                            {/* <p className="emp__card-link" 
                                onClick={() => {
                                    document.getElementById("contact-form")?.scrollIntoView({ 
                                        behavior: "smooth" 
                                    });
                                }}>
                                Reach out
                            </p> */}
                        </div>
                        <div className="emp__card">
                            <div className="emp__card-head">
                                <img src={Empower} alt="Icon" />
                                <h3>Goal-Oriented</h3>
                            </div>
                            <p className="emp__card-text">We don’t guess. We start with your goals and help you get there step by step, adjusting as you go, together.</p>
                            {/* <p className="emp__card-link" 
                                onClick={() => {
                                    document.getElementById("contact-form")?.scrollIntoView({ 
                                        behavior: "smooth" 
                                    });
                                }}>
                                Reach out
                            </p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default About;
