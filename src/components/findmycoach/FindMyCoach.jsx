import React from "react";
import "./findmycoach.css";
import Arrow from "../../assets/arrow.svg";
import { useNavigate } from "react-router-dom";

const FindMyCoach = () => {
  const navigate = useNavigate();

  const beginSurvey = () => {
    navigate("/survey")
  }

  return (
    <div className="fmc__section">
      <div className="fmc__container">
        <div className="fmc__head"></div>
        <div className="fmc__content">
          <h1 className="fmc__title">Find your kind of coach.</h1>
          <p className="fmc__tag">
            A few questions about your routine and preferences. About 3 minutes to find your starting point.
          </p>
          <button type="button" className="redirect__btn fmc-btn" data-track="quiz_start" data-source="coach_match_intro" onClick={beginSurvey}>
            <span>Start the quiz</span>
            <div className="redirect__btn-bg">
              <img src={Arrow} alt="" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindMyCoach;
