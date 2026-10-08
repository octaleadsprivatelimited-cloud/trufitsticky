import React, { useContext } from "react";
import { motion } from "framer-motion";
import Arrow from "../../assets/arrow.svg";
import { useNavigate } from "react-router-dom";
import SharedContext from "../../context/SharedContext";

const Squad = () => {
    const navigate = useNavigate();
    const { countryCode } = useContext(SharedContext);

    // Region-aware starting price. Defaults to the domestic (India-first) price
    // until the visitor's region resolves; switches to USD for international.
    const isInternational = countryCode === "INTERNATIONAL";
    const price = isInternational ? "$200" : "₹8,500";

    const meetCoach = () => {
        navigate("/coaches");
    };

    return (
        <>
            <div className="squad__section">
                <div className="squad__contianer">
                    <div className="squad__content">
                        <div className="squad__head">
                            <motion.h2
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                viewport={{ once: true, amount: 0.5 }}
                            >
                                Coaching plans starting at {price} for 12 weeks
                            </motion.h2>
                        </div>
                        <div className="squad__text">
                            <motion.p
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                viewport={{ once: true, amount: 0.5 }}
                            >
                                Custom workouts and a nutrition plan built from scratch, weekly check-ins, and real adjustments when life gets messy — no copy-paste plans, no disappearing after week one. Just steady support from a coach who’s actually paying attention.
                            </motion.p>
                        </div>
                        <div className="redirect__btn" onClick={meetCoach}>
                            <p>Meet your coach</p>
                            <div className="redirect__btn-bg">
                                <img src={Arrow} alt="Arrow" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Squad;
