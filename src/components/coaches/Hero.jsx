import React from "react";
import "../home/homePage.css"
import "./coachPage.css"
import Arrow from "../../assets/arrow.svg"
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    const findMyCoach = () => {
        navigate("/findmycoach")
    }
  return (
    <>
        <div className='hero__section'>
            <div className='hero__container'>
                <div className="coach__hero__img">
                    {/* <img src={Hero} alt="Hero Image" /> */}
                </div>
                <div className="hero__content">
                    <div className="hero__text">
                        <h1>Masters of their craft</h1>
                    </div>
                    <div className="hero__tag">
                        <p>Each of our elite certified coaches has unique style. Future pairs you with the one who best fits your goals and personality.</p>
                    </div>
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

export default Hero;
