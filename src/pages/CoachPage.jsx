import { scrollToSection } from '../scroll/smoothScroll';
import React, { useEffect } from "react";
import Coach from "../components/coaches/Coach";
import { useLocation } from "react-router-dom";

const CoachPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromQuestionnaire) {
      scrollToSection(document.getElementById("coach-section"));
    }
  }, [location]);

  return (
    <div id="coach-section">
      <Coach />
    </div>
  );
};

export default CoachPage;
