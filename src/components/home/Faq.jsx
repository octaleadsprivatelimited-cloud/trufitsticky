import { useState } from "react";
import FaqToggle from "../../assets/faq-toggle.svg"

const faqData = [
  {
    question: "What kind of programs do you offer?",
    answer: "We offer personalized online coaching plans focused on goals like weight loss, strength, endurance, and general fitness. Each plan includes both workouts and nutrition support, tailored to your lifestyle.",
  },
  {
    question: "Do I need any prior fitness experience?",
    answer: "Not at all. Whether you’re just starting out or picking it back up after a break, your coach will guide you step by step.",
  },
  {
    question: "How does the coaching work online?",
    answer: "Your coach builds a plan just for you and checks in weekly. You’ll track progress, ask questions, and get updates — all through chat and shared tools. Real support that fits your schedule.",
  },
  {
    question: "How often will I hear from my coach?",
    answer: "Expect weekly check-ins, feedback, and updates to your plan. You can also reach out anytime if you need help, adjustments, or just a little encouragement.",
  },
  {
    question: "Can I follow the program if I travel or have a changing schedule?",
    answer: "Yes! Your coach will build a plan that’s flexible and adjusts with you — whether you’re traveling, working late, or just having an off week.",
  },
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

  return (
    <>
        <div className="faq__section" id="faq">
            <div className="faq__container">
                <div className="faq__content">
                    <div className="faq__head">
                        <h2>Frequently Asked Questions (FAQs)</h2>
                    </div>
                    <div className="faq__main">
                      <div className="faq__qa">
                        {faqData.map((faq, index) => (
                                    <div key={index} className="faq__que-sec">
                                      <div className="faq__que-row" onClick={() => toggleAnswer(index)}>
                                        <p>{faq.question}</p>
                                        <img
                                          className={`faq__toggle-icon ${openIndex === index ? "rotate" : ""}`}
                                          src={FaqToggle}
                                          alt="Toggle FAQ"
                                        />
                                      </div>
                                      <div className={`faq__ans-wrapper ${openIndex === index ? "open" : ""}`}>
                                          <div className="faq__ans">
                                            {faq.answer}
                                          </div>
                                      </div>
                                    </div>
                                  ))}
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default Faq;
