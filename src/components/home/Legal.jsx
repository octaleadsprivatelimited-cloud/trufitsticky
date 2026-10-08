import React, { useEffect, useRef } from "react";
import CardClose from "../../assets/card-close.svg";

const Legal = ({ type, onClose }) => {
  const modalRef = useRef(null);

  // Handle click outside modal to close
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  // Add event listener for click outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const legalContent = {
    privacy: {
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
          content: "For any questions, concerns, or data-related requests, please contact:\nEmail: support@betrufit.com\nAddress: Tru Fit, Hyderabad, Telangana, India",
        },
      ],
    },
    terms: {
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
    },
    refund: {
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
          content: "For questions regarding this policy, please contact:\nEmail: support@betrufit.com\nAddress: Tru Fit, Hyderabad, Telangana, India",
        },
      ],
    },
  };

  const content = legalContent[type];

  if (!content) return null;

  return (
    <div className="legal__modal-overlay">
      <div className="legal__modal-container" ref={modalRef}>
        <div className="legal__modal-head">
          <img 
            src={CardClose} 
            alt="Close" 
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </div>
        
        <div className="legal__modal-content">
          <h1 className="legal__modal-title">{content.title}</h1>
          <p className="legal__modal-updated">Last Updated: {content.lastUpdated}</p>
          
            <div className="legal__modal-sections">
              {content.sections.map((section, index) => {
                // Check if heading is a sub-heading (starts with lowercase letter followed by period)
                const isSubHeading = section.heading && /^[a-z]\./.test(section.heading);
                
                return (
                  <div key={index} className="legal__section">
                    {section.heading && (
                      <h2 className={`legal__section-heading ${isSubHeading ? 'legal__section-subheading' : ''}`}>
                        {section.heading}
                      </h2>
                    )}
                    <p className={`legal__section-content ${isSubHeading ? 'legal__section-content-indented' : ''}`}>
                      {section.content}
                    </p>
                  </div>
                );
              })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;

