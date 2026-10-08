import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/home/homePage.css";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
  const content = {
    title: "Privacy Policy",
    lastUpdated: "October 7, 2026",
    sections: [
      {
        heading: "",
        content: "At Tru Fit, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you access or use our website, mobile application (\"Tru Fit App\"), and related services (collectively, the \"Services\").",
      },
      {
        heading: "",
        content: "By using our Services, you consent to the collection and use of your data as described in this Privacy Policy.",
      },
      {
        heading: "1. Information We Collect",
        content: "We collect information to deliver personalized coaching, enhance our AI systems, and improve your overall experience. The types of information we collect include:",
      },
      {
        heading: "a. Personal Information",
        content: "Information you provide directly, such as:\n• Name, age, gender, and contact details (email, phone number)\n• Payment information (processed through secure payment gateways)\n• Health and fitness details shared during registration or consultation\n• Progress updates, photos, and messages exchanged with your coach",
      },
      {
        heading: "b. Automatically Collected Information",
        content: "When you use our app or website, we automatically collect:\n• Device information (e.g., IP address, browser type, OS)\n• Usage data (e.g., log-ins, time spent, feature interactions)\n• Location data (when permission is granted)\n• Cookies or similar tracking technologies",
      },
      {
        heading: "c. Coach-Shared Data",
        content: "Coaches may input your progress, notes, or updates into the Tru Fit App to track performance and personalize recommendations.",
      },
      {
        heading: "d. AI Training & Third-Party Vendor Data",
        content: "Certain anonymized data (such as user metrics, dietary inputs, and workout adherence) may be shared with trusted third-party technology partners for:\n• AI algorithm training and improvement\n• Platform performance optimization\n• Personalized feature development\n\nWe never sell your personal information.",
      },
      {
        heading: "2. How We Use Your Information",
        content: "We use your information to:\n1. Deliver personalized fitness and nutrition plans\n2. Facilitate communication between you and your assigned Coach\n3. Operate and enhance the AI features within the Tru Fit App\n4. Process payments and maintain service records\n5. Provide customer support and resolve technical issues\n6. Analyze usage to improve service quality and app functionality\n7. Comply with legal, regulatory, and tax obligations\n\nWe may also use aggregated or anonymized data for internal analytics and product research. This data does not identify any individual user.",
      },
      {
        heading: "3. Sharing Your Information",
        content: "We may share your data with limited, authorized parties under strict confidentiality:",
      },
      {
        heading: "a. Coaches",
        content: "Your assigned Coach may access your fitness, nutrition, and progress data to deliver and track personalized programs.",
      },
      {
        heading: "b. Third-Party Vendors",
        content: "We partner with trusted vendors to provide services such as:\n• Cloud storage and hosting\n• AI model development and testing\n• Payment processing\n• Email and communication tools\n\nAll vendors are contractually obligated to protect your information, use it solely for the intended purpose, and maintain appropriate security safeguards.",
      },
      {
        heading: "c. Legal Compliance",
        content: "We may disclose your information if required by law, regulation, or court order, or to protect Tru Fit's rights, property, or safety, or that of our users and partners.",
      },
      {
        heading: "d. Business Transfers",
        content: "In case of a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction, in compliance with applicable data protection laws.",
      },
      {
        heading: "4. Data Retention",
        content: "We retain your information for as long as necessary to fulfill the purposes outlined in this policy or as required by law.\n• Coaching-related data may be retained for up to 24 months after program completion.\n• Financial transaction records may be stored longer for compliance purposes.\n• You may request deletion of your account and data at any time (see Section 9).",
      },
      {
        heading: "5. Data Security",
        content: "We use a combination of administrative, technical, and physical safeguards to protect your data, including:\n• End-to-end encryption of sensitive data\n• Secure cloud storage and access controls\n• Restricted access to personal information within our organization\n• Regular system audits and compliance checks\n\nWhile we strive to ensure security, no method of electronic storage or transmission is completely secure. You use our Services at your own risk.",
      },
      {
        heading: "6. International Data Transfers",
        content: "Tru Fit operates globally and may transfer data to servers or partners located outside your country of residence (e.g., for cloud or AI services).\n\nAll transfers are conducted in compliance with applicable laws, and we ensure equivalent data protection standards are maintained.",
      },
      {
        heading: "7. Cookies and Tracking Technologies",
        content: "Essential browser storage supports region preferences and the booking flow. With your optional analytics consent, Google Analytics 4 measures page visits and interactions, and Microsoft Clarity provides heatmaps and session recordings to help us improve the website. Analytics events do not contain your form responses, name, email, phone number, or health goals. Forms are masked in session recordings. We do not enable advertising storage or send user identifiers.\n\nYou can decline analytics and continue using the website. Open Cookie preferences in the footer to change your choice at any time. Google and Microsoft may process analytics information on their servers. For data requests, contact support@betrufit.com.",
      },
      {
        heading: "8. Children's Privacy",
        content: "Our Services are not directed toward individuals under the age of 18. We do not knowingly collect data from minors. If we become aware that we have collected information from a minor without parental consent, we will delete it promptly.",
      },
      {
        heading: "9. Your Rights",
        content: "Depending on your jurisdiction (including GDPR and CCPA regions), you may have the right to:\n• Access your personal information\n• Request correction or deletion of your data\n• Object to processing or restrict certain uses\n• Withdraw consent at any time (where applicable)\n• Request data portability\n\nTo exercise these rights, please contact us at support@betrufit.com. We will respond within a reasonable timeframe, typically within 30 days.",
      },
      {
        heading: "10. Changes to This Policy",
        content: "Tru Fit may update this Privacy Policy periodically. Updated versions will be posted on our website with a revised \"Last Updated\" date. Continued use of our Services after such updates constitutes acceptance of the revised policy.",
      },
      {
        heading: "11. Contact Us",
        content: "For any questions, concerns, or data-related requests, please contact:\nEmail: support@betrufit.com",
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

export default PrivacyPolicyPage;

