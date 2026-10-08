import React, { useState, useRef, useCallback } from "react";
import { trackEvent } from "../analytics/analytics";
import { ContactDetails, FooterBottom } from "./Footer";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "./home/homePage.css"; // Import CSS eagerly so background image is available

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("us");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isSubmittingRef = useRef(false);


  const validate = useCallback(() => {
    const errs = {};
    if (!formData.name || formData.name.trim().length < 3) {
      errs.name = "Name must be at least 3 characters";
    }
    if (!formData.email) {
      errs.email = "Email is required";
    } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!phone || phone.length < 10) {
      errs.phone = "Valid phone number is required";
    }
    return errs;
  }, [formData.name, formData.email, phone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    // Guard against double submission (loading, already submitted, or ref lock)
    if (loading || submitted || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setErrors({});
    setSuccess("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      isSubmittingRef.current = false;
      trackEvent("form_error", { form_id: "contact", error_type: "validation" });
      return;
    }

    // Format phone number with space after country code
    // Remove any existing spaces first
    const cleanPhone = phone.replace(/\s/g, "");
    let formattedPhone = cleanPhone;

    // Country code mapping - maps country ISO2 code to its calling code
    const countryCodeMap = {
      us: "+1",
      ca: "+1",
      gb: "+44",
      in: "+91",
      au: "+61",
      ae: "+971",
      // Add more as needed
    };

    // If phone doesn't already have a space after country code, add it
    if (cleanPhone.startsWith("+") && !cleanPhone.includes(" ")) {
      // Use the tracked country to get the correct country code
      const expectedCountryCode = countryCodeMap[country];

      if (expectedCountryCode && cleanPhone.startsWith(expectedCountryCode)) {
        // Use the known country code
        formattedPhone = cleanPhone.replace(expectedCountryCode, `${expectedCountryCode} `);
      } else {
        // Fallback: Try to detect country code using known patterns
        // Check for 3-digit codes first (200-999, but not starting with 0)
        const match3 = cleanPhone.match(/^(\+[2-9]\d{2})(\d{4,})/);
        if (match3) {
          formattedPhone = `${match3[1]} ${match3[2]}`;
        } else {
          // Check for 2-digit codes (10-99)
          const match2 = cleanPhone.match(/^(\+[1-9]\d)(\d{4,})/);
          if (match2) {
            formattedPhone = `${match2[1]} ${match2[2]}`;
          } else {
            // Check for 1-digit codes (1-9)
            const match1 = cleanPhone.match(/^(\+[1-9])(\d{4,})/);
            if (match1) {
              formattedPhone = `${match1[1]} ${match1[2]}`;
            }
          }
        }
      }
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone_number: formattedPhone,
      goal: "",
    };

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin_functions/enquiry/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit form");
      }

      // Fetch WhatsApp number from site settings and redirect
      try {
        let whatsappNumber = '918520857988'; // fallback default
        try {
          const settingsRes = await fetch(
            `${import.meta.env.VITE_BASE_URL}/admin_functions/site-settings/`
          );
          if (settingsRes.ok) {
            const settings = await settingsRes.json();
            if (settings.whatsapp_number) {
              whatsappNumber = settings.whatsapp_number;
            }
          }
        } catch {
          // Use fallback number
        }

        const whatsappMessage = encodeURIComponent(
          `Hi, I'm ${formData.name}. I'd like to know more about your coaching plans!`
        );

        // Detect mobile vs desktop
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const whatsappUrl = isMobile
          ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
          : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`;

        window.open(whatsappUrl, '_blank');
      } catch (whatsappErr) {
        // If WhatsApp redirect fails, still show success
        if (import.meta.env.DEV) {
          console.error('WhatsApp redirect failed:', whatsappErr);
        }
      }

      trackEvent("generate_lead", { form_id: "contact" });
      setSuccess("Thank you! Your enquiry has been submitted. You're being redirected to WhatsApp.");
      setSubmitted(true);
      setFormData({ name: "", email: "" });
      setPhone("");
      // Prevent resubmission on page refresh
      try { sessionStorage.setItem('trufit_enquiry_submitted', Date.now().toString()); } catch { /* The form can still complete without session storage. */ }
    } catch (err) {
      trackEvent("form_error", { form_id: "contact", error_type: "network" });
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  }, [loading, submitted, formData, phone, country, validate]);

  return (
    <section className="contact-shell wrap" id="contact-form" tabIndex={-1} aria-labelledby="contact-title">
      <div className="contact-panel">
        <div className="contact-form-column">
          <div className="contact-heading">
            <p className="eyebrow">Your next step starts here</p>
            <h2 id="contact-title">LET’S <em>TALK.</em></h2>
            <p>Tell us a little about yourself. We’ll help you find the right support.</p>
          </div>
          <form data-clarity-mask="true" data-form-id="contact" className="contact-fields" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="name">Full name <span aria-hidden="true">*</span></label>
              <input type="text" name="name" id="name" autoComplete="name" placeholder="Your full name" value={formData.name} onChange={handleChange} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name?'contact-name-error':undefined}/>
              {errors.name&&<p className="contact-error" id="contact-name-error">{errors.name}</p>}
            </div>
            <div className="contact-field">
              <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
              <input type="email" name="email" id="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email?'contact-email-error':undefined}/>
              {errors.email&&<p className="contact-error" id="contact-email-error">{errors.email}</p>}
            </div>
            <div className="contact-field">
              <label htmlFor="mobile">WhatsApp number <span aria-hidden="true">*</span></label>
              <PhoneInput defaultCountry="us" value={phone} onChange={(value,countryData)=>{setPhone(value);if(countryData?.country?.iso2)setCountry(countryData.country.iso2);else if(countryData?.iso2)setCountry(countryData.iso2)}} charAfterDialCode=" " preferredCountries={["us","in","gb","ca","au","ae"]} inputProps={{id:"mobile",name:"mobile",required:true,autoComplete:"tel",'aria-invalid':Boolean(errors.phone),'aria-describedby':errors.phone?'contact-phone-error':undefined}}/>
              {errors.phone&&<p className="contact-error" id="contact-phone-error">{errors.phone}</p>}
            </div>
            {errors.submit&&<p className="contact-error" role="alert">{errors.submit}</p>}
            {success&&<p className="contact-success" role="status">{success}</p>}
            <button type="submit" className="contact-submit" disabled={loading||submitted}><span>{submitted?"Submitted ✓":loading?"Sending…":"Let’s get started"}</span><span aria-hidden="true">↗</span></button>
            <p className="contact-form-note">We’ll use these details to respond to your enquiry.</p>
          </form>
        </div>
        <ContactDetails/>
      </div>
      <FooterBottom/>
    </section>
  );
};

export default ContactForm;
