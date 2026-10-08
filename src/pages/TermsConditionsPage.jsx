import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/home/homePage.css";

const TermsConditionsPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
  const content = {
    title: "Terms & Conditions",
    lastUpdated: "October 2025",
    sections: [
      {
        heading: "",
        content: "Welcome to Tru Fit! These Terms and Conditions (\"Terms\") constitute a legally binding agreement between you (whether personally or on behalf of an entity) and Tru Fit (\"Company,\" \"we,\" \"our,\" or \"us\"), governing your access to and use of our website, AI-powered client application, social media channels, emails, and other related services (collectively, the \"Services\").",
      },
      {
        heading: "",
        content: "By accessing or using any part of the Services, you acknowledge that you have read, understood, and agreed to be bound by these Terms. If you do not agree, please discontinue use immediately.",
      },
      {
        heading: "1. Overview of Services",
        content: "Tru Fit provides personalized fitness coaching and nutrition programs in collaboration with independent fitness professionals (\"Coaches\"). When you purchase a coaching plan or service, you enter into a service relationship jointly with Tru Fit and the assigned Coach, who together are responsible for delivering the agreed services.\n\nTru Fit's services are delivered primarily through its AI-powered client application (\"Tru Fit App\"), which facilitates personalized coaching, progress tracking, and communication between clients and coaches.\n\nTru Fit continuously enhances its AI features by collaborating with third-party technology vendors. Some client data may be shared with these vendors to improve service accuracy, functionality, and overall experience. This data sharing follows strict confidentiality and security standards, as detailed in our Privacy Policy.",
      },
      {
        heading: "2. Health Disclaimer",
        content: "The content and coaching provided by Tru Fit and its Coaches are not a substitute for professional medical advice, diagnosis, or treatment.\n• Always consult your physician or qualified healthcare provider before beginning any new fitness or nutrition program.\n• If you experience faintness, dizziness, or discomfort during exercise or while following a plan, stop immediately and seek medical attention.\n\nTru Fit and its Coaches are not medical professionals, and no part of our Services constitutes medical advice. You voluntarily assume all risks associated with your participation.",
      },
      {
        heading: "3. No Guarantee of Results",
        content: "Tru Fit's AI and coaching services are designed to deliver meaningful progress toward your fitness and wellness goals; however, individual results vary based on adherence, effort, health conditions, and other factors. Tru Fit and its Coaches do not guarantee any specific outcomes or performance results.",
      },
      {
        heading: "4. Intellectual Property Rights",
        content: "All content provided by Tru Fit, including the Tru Fit App, website, text, graphics, videos, software, and AI systems, is the exclusive property of Tru Fit or its licensors and is protected under international copyright, trademark, and intellectual property laws.\n\nYou are granted a limited, non-exclusive, non-transferable license to use our Services for personal, non-commercial purposes only. You may not:\n• Copy, reproduce, or distribute any materials without prior written permission;\n• Use any Tru Fit content for commercial purposes; or\n• Modify, decompile, or reverse-engineer any part of the Tru Fit App or platform.",
      },
      {
        heading: "5. User Responsibilities",
        content: "By using Tru Fit's Services, you represent and warrant that:\n1. All information provided during registration and payment is true, accurate, and current.\n2. You have the legal capacity to enter into these Terms.\n3. You are not a minor in your jurisdiction of residence.\n4. You will not use automated means (e.g., bots, scripts) to access the Services.\n5. You will not use the Services for any unlawful or unauthorized purpose.\n6. Your use of the Services will comply with all applicable laws and regulations.\n\nTru Fit reserves the right to suspend or terminate your access if you provide false, incomplete, or misleading information.",
      },
      {
        heading: "6. Payments and Pricing",
        content: "Some Services require payment of fees. By purchasing or subscribing, you agree to:\n• Provide accurate and current payment details;\n• Authorize Tru Fit to charge your selected payment method;\n• Accept that prices may vary by region to reflect purchasing power parity and market conditions.\n\nMisrepresentation of your location or identity to obtain lower pricing will result in immediate termination of Services without refund.\n\nTru Fit reserves the right to correct pricing errors and modify pricing at its sole discretion.",
      },
      {
        heading: "7. Program Policies",
        content: "• Coaching programs cannot be paused, transferred, or put on hold once started.\n• Programs are non-transferable and non-saleable.\n• Misuse of account credentials or sharing proprietary content with others will result in termination of Services without refund.",
      },
      {
        heading: "8. Cancellations and Refunds",
        content: "• Consultation Calls:\nAll consultation call bookings are non-refundable, regardless of attendance or completion. Once payment is made, no refunds will be issued for any reason.\n\n• After Initial Consultation (Coaching Programs):\nOnce your initial consultation with the assigned Coach is complete, no refunds shall be issued for coaching programs or services.\n\n• Before Plan Delivery:\nRefund requests made before the initial plan delivery (and before the consultation is conducted) will incur a 20% administrative fee and will be processed within 5–7 business days.\n\n• Program Holds and Transfers:\nCoaching programs cannot be paused, transferred, or put on hold once started.\n\n• Chargebacks:\nChargebacks will not be tolerated. Any attempt will result in a lifetime ban from Tru Fit Services and may be pursued under applicable law.\n\nFor further details, please refer to our Refund Policy.",
      },
      {
        heading: "9. Limitation of Liability",
        content: "Tru Fit and its Coaches will not be held liable for any direct, indirect, incidental, consequential, or punitive damages, including but not limited to:\n• Economic loss or business interruption;\n• Injury, illness, or death;\n• Data loss, service disruption, or unauthorized access related to third-party integrations.\n\nYour use of the Services is entirely at your own risk.",
      },
      {
        heading: "10. Third-Party Vendors and Data Sharing",
        content: "Tru Fit collaborates with third-party service providers and technology partners to develop and operate its AI-powered platform. This may involve sharing limited, relevant data (such as anonymized fitness or dietary inputs) for the following purposes:\n• Enhancing AI recommendations and functionality;\n• Delivering personalized fitness and nutrition guidance;\n• Maintaining and improving system performance and security.\n\nAll such data sharing is conducted under strict contractual confidentiality agreements with vendors to ensure privacy and prevent misuse. Details on how your data is handled are provided in our Privacy Policy.",
      },
      {
        heading: "11. Service Modifications",
        content: "Tru Fit reserves the right to modify, suspend, or discontinue any aspect of its Services—including pricing, features, or content—at any time without prior notice. We are not liable to you or any third party for any resulting loss or inconvenience.",
      },
      {
        heading: "12. Dispute Resolution",
        content: "All disputes arising from or related to these Terms or your use of Tru Fit Services shall be governed by the laws of India, with exclusive jurisdiction in the courts of Hyderabad, Telangana.",
      },
      {
        heading: "13. Acceptance of Terms",
        content: "By purchasing a Tru Fit program, registering on our website, or using the Tru Fit App, you confirm that you have read, understood, and agreed to these Terms and Conditions.",
      },
      {
        heading: "14. Contact Us",
        content: "For questions or concerns regarding these Terms, please contact us at:\nEmail: support@betrufit.com",
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

export default TermsConditionsPage;

