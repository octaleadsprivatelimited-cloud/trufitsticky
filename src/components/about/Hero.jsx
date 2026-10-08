import React from "react";
import "./aboutPage.css"

const Hero = () => {
  return (
    <>
        <div className='abt__hero__section'>
            <div className='abt__hero__container'>
                <div className="abt__hero__img">
                    {/* <img src={Hero} alt="Hero Image" /> */}
                </div>
                <div className="abt__hero__content">
                    <div className="abt__hero__text">
                        <h1>We believe fitness should feel human, not robotic</h1>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default Hero;
