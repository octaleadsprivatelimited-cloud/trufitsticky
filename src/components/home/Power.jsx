import { motion } from "framer-motion";
import PowerOne from "../../assets/power-one.webp"
import PowerTwo from "../../assets/power-two.webp"
import PowerThree from "../../assets/power-three.webp"
import PowerFour from "../../assets/power-four.webp"
import PowerFive from "../../assets/power-five.webp"
import PowerSix from "../../assets/power-six.webp"

const Power = () => {
    // const rowRef = useRef(null);
    // const rowInView = useInView(rowRef, { once: true });
  return (
    <>
        <div className="pow__section">
            <div className="pow__container">
                <div className="pow__content">
                    <div className="pow__head">
                        <motion.h2 
                            className="pow__head-title"
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.5 }}>
                                The Future of Fitness, Today!
                        </motion.h2>
                        <motion.p
                            className="pow__head-tag"
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.5 }}>
                            Tru Fit blends human coaching and AI innovation to bring you support, accountability, and results.
                        </motion.p>
                    </div>
                    <div className="pow__card-container">
                        <motion.div 
                            className="pow__card-row row-odd"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <div className="pow__card card-one">
                                <div className="pow__card-text">
                                    <motion.h3
                                        className="pow__card-title"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        AI-Powered App
                                    </motion.h3>
                                    <motion.p 
                                        className="pow__card-desc"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        Your 24/7 fitness companion—guidance, reminders, and insights right in your pocket.
                                    </motion.p>
                                </div>
                                    <div className="pow__card-img">
                                        <motion.img 
                                            src={PowerOne} 
                                            alt="Image"
                                            initial={{ y: 50, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            viewport={{ once: true, amount: 0.5 }}
                                         />
                                    </div>
                            </div>
                            <div className="pow__card card-two">
                                <div className="pow__card-text">
                                    <motion.h3
                                        className="pow__card-title"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        Daily To-Dos
                                    </motion.h3>
                                    <motion.p 
                                        className="pow__card-desc"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        Stay on track with simple daily tasks that keep your fitness journey organized.
                                    </motion.p>
                                </div>
                                    <div className="pow__card-img">
                                        <motion.img 
                                            src={PowerTwo} 
                                            alt="Image"
                                            initial={{ y: 50, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            viewport={{ once: true, amount: 0.5 }}
                                         />
                                    </div>
                            </div>
                        </motion.div>
                        <motion.div 
                            className="pow__card-row row-even"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <div className="pow__card card-one">
                                <div className="pow__card-text">
                                    <motion.h3
                                        className="pow__card-title"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        Smart Meal Feedback
                                    </motion.h3>
                                    <motion.p 
                                        className="pow__card-desc"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        Log meals and get instant feedback with our AI nutrition analyzer and tracker.
                                    </motion.p>
                                </div>
                                    <div className="pow__card-img">
                                        <motion.img 
                                            src={PowerThree} 
                                            alt="Image"
                                            initial={{ y: 50, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            viewport={{ once: true, amount: 0.5 }}
                                         />
                                    </div>
                            </div>
                            <div className="pow__card card-two">
                                <div className="pow__card-text">
                                    <motion.h3
                                        className="pow__card-title"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        Personalized Meals
                                    </motion.h3>
                                    <motion.p 
                                        className="pow__card-desc"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        Tailored meal plans that work with your lifestyle, preferences, and progress.
                                    </motion.p>
                                </div>
                                    <div className="pow__card-img">
                                        <motion.img 
                                            src={PowerFour} 
                                            alt="Image"
                                            initial={{ y: 50, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            viewport={{ once: true, amount: 0.5 }}
                                         />
                                    </div>
                            </div>
                        </motion.div>
                        <motion.div 
                            className="pow__card-row row-odd"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <div className="pow__card card-one">
                                <div className="pow__card-text">
                                    <motion.h3
                                        className="pow__card-title"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        Personalized Workouts
                                    </motion.h3>
                                    <motion.p 
                                        className="pow__card-desc"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        Custom plans designed by your coach and optimized by AI to fit your goals.
                                    </motion.p>
                                </div>
                                    <div className="pow__card-img">
                                        <motion.img 
                                            src={PowerFive} 
                                            alt="Image"
                                            initial={{ y: 50, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            viewport={{ once: true, amount: 0.5 }}
                                         />
                                    </div>
                            </div>
                            <div className="pow__card card-two">
                                <div className="pow__card-text">
                                    <motion.h3
                                        className="pow__card-title"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        Progress Tracker
                                    </motion.h3>
                                    <motion.p 
                                        className="pow__card-desc"
                                        initial={{ y: 50, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        Track workouts, meals, and habits over time to see your results in action.
                                    </motion.p>
                                </div>
                                    <div className="pow__card-img">
                                        <motion.img 
                                            src={PowerSix} 
                                            alt="Image"
                                            initial={{ y: 50, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            viewport={{ once: true, amount: 0.5 }}
                                         />
                                    </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default Power;
