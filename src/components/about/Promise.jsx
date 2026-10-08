import React from "react";
import PromiseOne from "../../assets/promise-one.webp"
import PromiseTwo from "../../assets/promise-two.webp"
import PromiseThree from "../../assets/promise-three.webp"
import PromiseFooter from "../../assets/promise-footer.webp"
import Arrow from "../../assets/arrow.svg"
import { useNavigate } from "react-router-dom";

const Promise = () => {
    const navigate = useNavigate();

    const findMyCoach = () => {
        navigate("/findmycoach")
    }

  return (
    <>
        <div className="prom__section">
            <div className="prom__container">
                <div className="prom__content">
                    <div className="prom__head">
                        <h2>Our Promise</h2>
                    </div>
                    <div className="prom__main">
                        <div className="prom__card">
                            <img src={PromiseOne} alt="Inidvidual Journey Image" />
                            <div className="prom__card-content">
                                <h3 className="prom__card-title">Your Individual Journey</h3>
                                <p className="prom__card-desc">Every person is unique, and so is every fitness journey. We create personalized programs that cater to your current stage and address your unique needs. No quick fixes, just real solutions.</p>
                            </div>
                        </div>
                        <div className="prom__card">
                            <img src={PromiseTwo} alt="Habits THat Last Image" />
                            <div className="prom__card-content">
                                <h3 className="prom__card-title">Habits That Last</h3>
                                <p className="prom__card-desc">We focus on building sustainable habits that become part of your lifestyle, not temporary fixes that disappear when the program ends.</p>
                            </div>
                        </div>
                        <div className="prom__card">
                            <img src={PromiseThree} alt="Ongoing Support Image" />
                            <div className="prom__card-content">
                                <h3 className="prom__card-title">Ongoing Support</h3>
                                <p className="prom__card-desc">From setbacks to victories, we're with you every step of the way. Your success is our success, and we celebrate every milestone together.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="prom__footer-img">
                <div className="prom__footer-content">
                    <p className="prom__footer-quote">
                        Because at Tru Fit, we don't just build better bodies. We help you become the best version of yourself.
                    </p>
                </div>
                <div className="prom__footer-btn">
                    {/* "Find My Coach" CTA hidden per request — kept for easy restore */}
                    {/* <div className="redirect__btn" onClick={findMyCoach}>
                        <p>Find My Coach</p>
                        <div className="redirect__btn-bg">
                            <img src={Arrow} alt="Arrow" />
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    </>
  );
};

export default Promise;
