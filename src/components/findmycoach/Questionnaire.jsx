import { useState, useContext, useEffect, useRef } from "react";
import SharedContext from "../../context/SharedContext";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { scrollToSection } from "../../scroll/smoothScroll";
import "./findmycoach.css";
import "./coachMatchForm.css";

const Questionnaire = () => {
  const { setQueFilteredCoaches } = useContext(SharedContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Option 2: Clear data upon starting a New Questionnaire
  useEffect(() => {
    sessionStorage.removeItem("capturedLead");
  }, []);

  const questions = [
    {
      question: "What's your experience with fitness?",
      options: [
        "I'm new to this",
        "I used to work out and want to get back into it",
        "I currently work out",
        "I am a fitness enthusiast",
      ],
    },
    {
      question: "What's your top fitness goal?",
      options: [
        "Lose weight",
        "Get toned",
        "Increase muscle mass",
        "Improve health and longevity",
        "Improve as an athlete or competitor",
        "I'm not sure",
      ],
    },
    {
      question: "What's your gender?",
      options: ["Female", "Male", "Non-binary", "Prefer not to answer"],
    },
    {
      question: "What's your age?",
      options: ["19 or younger", "20s", "30s", "40s", "50s", "60 or older"],
    },
    {
      question: "Anything else we should know?",
      options: [
        "I have an injury that affects my physical activity",
        "I have a health condition",
        "I have a physical disability",
        "Nothing else",
      ],
    },
    {
      question: "What do you prefer?",
      options: ["Female coach", "Male coach", "No preference"],
    },
  ];

  const [answers, setAnswers] = useState({});
  const questionRefs = useRef([]);
  const submitRef = useRef(null);
  const selectAnswer = (questionIndex, option) => {
    setAnswers(previous => ({ ...previous, [questionIndex]: option }));
    const next = questionRefs.current[questionIndex + 1] || submitRef.current;
    scrollToSection(next);
    next?.focus({ preventScroll: true });
  };
  const answeredCount = Object.keys(answers).length;
  const allQuestionsAnswered = answeredCount === questions.length;

  const handleSubmit = async (finalAnswers) => {
    if (loading) return;
    if (!allQuestionsAnswered) return;
    const payload = {
      // Backward compatible fields
      gender: mapGender(finalAnswers[5]),
      injury: finalAnswers[4] !== "Nothing else",
      // Full questionnaire data for enhanced matching
      experience: finalAnswers[0] || "",
      goal: finalAnswers[1] || "",
      user_gender: finalAnswers[2] || "",
      age_range: finalAnswers[3] || "",
      health_condition: finalAnswers[4] || "",
      coach_preference: finalAnswers[5] || "",
    };

    try {
      setLoading(true);
      setError("");
      
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin_functions/recommend/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Matching unavailable");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid matches");


      setQueFilteredCoaches(data);
      navigate("/coaches", { state: { fromQuestionnaire: true, coachCount: data.length } });
    } catch (err) {
      setError("We couldn’t load your matches. Please try again or browse all coaches.");
      if (import.meta.env.DEV) {
        console.error("Error submitting:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Helpers
  const mapGender = (value) => {
    if (value === "Male coach") return "male";
    if (value === "Female coach") return "female";
    if (value === "No preference") return "anyone";
  };

  return (
    <section className="coach-match wrap" aria-labelledby="coach-match-title">
      {loading && <Spinner />}
      <header className="coach-match-heading">
        <p className="eyebrow">A little about you</p>
        <h1 id="coach-match-title">Find your <em>kind of coach.</em></h1>
        <p>Choose an answer to move ahead. Scroll back anytime to change it.</p>
      </header>
      <form className="coach-match-form" data-clarity-mask="true" aria-busy={loading}
        onSubmit={event => { event.preventDefault(); handleSubmit(answers); }}>
        <div className="coach-match-questions">
          {questions.map(({ question, options }, questionIndex) => (
            <fieldset className="coach-match-question" key={question} disabled={loading}
              tabIndex={-1} ref={node => { questionRefs.current[questionIndex] = node; }}>
              <legend>{question}</legend>
              <div className="coach-match-options">
                {options.map(option => (
                  <label className="coach-match-option" key={option}>
                    <input type="radio" name={`question-${questionIndex}`} value={option} required
                      checked={answers[questionIndex] === option}
                      onChange={() => selectAnswer(questionIndex, option)} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        {error && <div role="alert" className="catalogue-note">{error} <button type="button" className="text-link" onClick={() => navigate("/coaches")}>Browse coaches →</button></div>}
        <div className="coach-match-submit" tabIndex={-1} ref={submitRef}>
          <div>
            <p aria-live="polite">{answeredCount} of {questions.length} answered</p>
            <span>{allQuestionsAnswered ? "Ready when you are." : "Answer each question to find your match."}</span>
          </div>
          <button className="button button-dark" type="submit" disabled={!allQuestionsAnswered || loading}>
            {loading ? 'Finding your matches…' : 'Find my coach ↗'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Questionnaire;
