import React from "react";
import "./homePage.css"
import Arrow from "../../assets/arrow.svg"
import HeroVideo from "../../assets/hero-video.mp4"
import HeroVideoMobile from "../../assets/hero-video-mobile.mp4"
import HeroVideoPoster from "../../assets/hero-video-poster.webp"
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const navigate = useNavigate();

    const findMyCoach = () => {
        navigate("/findmycoach")
    }
    
  return (
    <>
        <div className='hero__section'>
            <div className='hero__container'>
                <div className="hero__img" aria-hidden="true">
                    <video
                        className="hero__video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={HeroVideoPoster}
                    >
                        <source media="(max-width: 767px)" src={HeroVideoMobile} type="video/mp4" />
                        <source src={HeroVideo} type="video/mp4" />
                    </video>
                </div>
                <div className="hero__content">
                    <div className="hero__text">
                        <h1>We make it easier to start, and stick with it</h1>
                    </div>
                    <div className="hero__tag">
                        <p>A real coach. A real plan. Real support when you need it most. Because it's easier when we are in your corner.</p>
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

export default HeroSection;
