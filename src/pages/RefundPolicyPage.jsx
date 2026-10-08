import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/home/homePage.css";

const RefundPolicyPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
  const content = {
    title: "Refund Policy",
    lastUpdated: "October 2025",
    sections: [
      {
        heading: "",
        content: "At Tru Fit, we are committed to providing a high-quality fitness coaching experience through our coaches and AI-powered app.",
      },
      {
        heading: "",
        content: "Because our programs are personalized and begin immediately after consultation or plan delivery, our refund policy is intentionally structured to ensure fairness and accountability for both clients and coaches.",
      },
      {
        heading: "",
        content: "Please read this policy carefully before making any purchase.",
      },
      {
        heading: "1. Consultation Calls",
        content: "All consultation call bookings are non-refundable.\n\nOnce a consultation session is scheduled and payment is made, no refunds will be issued — regardless of attendance, cancellation, or technical issues not caused by Tru Fit.\n\nWe encourage clients to confirm their availability and ensure proper internet connectivity before booking a consultation.",
      },
      {
        heading: "2. Coaching Programs",
        content: "",
      },
      {
        heading: "a. After Initial Consultation",
        content: "Once your initial consultation with your assigned Coach has been completed, the program is considered started, and no refunds will be issued under any circumstances.\n\nThis applies even if you decide not to continue or fail to follow the plan provided.",
      },
      {
        heading: "b. Before Plan Delivery",
        content: "If you request a refund before your first consultation or before receiving your initial plan, a 20% administrative fee will be deducted from the total payment. Eligible refunds will be processed within 5–7 business days after approval.",
      },
      {
        heading: "c. Program Holds and Transfers",
        content: "Programs cannot be paused, postponed, or transferred to another person once started. Each program is custom-built for the enrolled client and cannot be reused or reassigned.",
      },
      {
        heading: "3. Chargebacks and Payment Disputes",
        content: "Tru Fit maintains detailed records of every transaction, consultation, and service provided.\n• Chargeback attempts made through your bank or payment provider are strictly prohibited and may result in:\n  ○ Immediate termination of all current and future services, and\n  ○ A lifetime ban from using Tru Fit's platform or programs.\n• In cases of legitimate billing errors, please reach out to support@betrufit.com before initiating a chargeback.",
      },
      {
        heading: "4. Refunds for Technical or Platform Issues",
        content: "If a technical error occurs (e.g., duplicate charges or failed transactions), please contact our support team within 7 days of the issue.\nRefunds for such errors will be reviewed and, if approved, processed in 5–7 business days.\nTru Fit will not be responsible for connectivity issues on the client's end (e.g., poor internet, device malfunction).",
      },
      {
        heading: "5. Digital Products and AI App Access",
        content: "Access to Tru Fit's AI-powered app, dashboard, and personalized features begins immediately upon enrollment.\n\nAs these are digital and custom-generated services, no refunds are provided once access is granted, even if the app is not actively used.",
      },
      {
        heading: "6. Misrepresentation and Compliance",
        content: "• Pricing and program availability vary by region and are based on local purchasing power.\n• Misrepresentation of location or identity to obtain discounted pricing will result in termination of services without any refund.\n• Tru Fit reserves the right to modify pricing or offerings at any time.",
      },
      {
        heading: "7. How to Request a Refund (If Eligible)",
        content: "If your situation meets the criteria for an eligible refund:\n1. Email support@betrufit.com with your registered email ID, order ID, and reason for the request.\n2. Our team will review your request within 3–5 business days.\n3. Approved refunds will be processed to the original payment method within 5–7 business days.",
      },
      {
        heading: "8. Final Decision",
        content: "All refund decisions made by Tru Fit are final and at the company's sole discretion.\n\nBy purchasing any program or consultation, you acknowledge that you have read, understood, and agreed to this Refund Policy.",
      },
      {
        heading: "9. Contact Us",
        content: "For questions regarding this policy, please contact:\nEmail: support@betrufit.com",
      },
    ],
  };

  return (
    <div className="legal__page">
      <div className="legal__page-container">
        <button
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontFamily: "Open Sans",
            color: "#9c27ff",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 0",
            marginBottom: "20px"
          }}
        >
          ← Back
        </button>
        <h1 className="legal__page-title">{content.title}</h1>
        <p className="legal__page-updated">Last Updated: {content.lastUpdated}</p>
        
        <div className="legal__page-sections">
          {content.sections.map((section, index) => {
            const isSubHeading = section.heading && /^[a-z]\./.test(section.heading);
            
            return (
              <div key={index} className="legal__page-section">
                {section.heading && (
                  <h2 className={`legal__page-section-heading ${isSubHeading ? 'legal__page-section-subheading' : ''}`}>
                    {section.heading}
                  </h2>
                )}
                <p className={`legal__page-section-content ${isSubHeading ? 'legal__page-section-content-indented' : ''}`}>
                  {section.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;

