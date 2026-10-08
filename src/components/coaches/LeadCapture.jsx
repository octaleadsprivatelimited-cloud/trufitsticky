import { useRef, useState, useEffect } from "react";
import { trackEvent } from '../../analytics/analytics';
import Logo from "../../assets/logo.svg";

const LeadCapture = ({ leadData, setLeadData, onSubmit, coachCount, onClose }) => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const countryCodeRef = useRef(null);
  const phoneRef = useRef(null);
  const contentRef = useRef(null);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    country_code: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);

  // Country code options with top 5 first
  const countryOptions = [
    { code: "1", name: "USA", digits: 10 },
    { code: "91", name: "India", digits: 10 },
    { code: "44", name: "Great Britain", digits: 10 },
    { code: "61", name: "Australia", digits: 9 },
    { code: "971", name: "UAE", digits: 9 },
    { code: "33", name: "France", digits: 10 },
    { code: "49", name: "Germany", digits: 11 },
    { code: "81", name: "Japan", digits: 10 },
    { code: "65", name: "Singapore", digits: 8 },
    { code: "60", name: "Malaysia", digits: 10 },
    { code: "66", name: "Thailand", digits: 9 },
    { code: "63", name: "Philippines", digits: 10 },
    { code: "62", name: "Indonesia", digits: 11 },
    { code: "55", name: "Brazil", digits: 11 },
    { code: "52", name: "Mexico", digits: 10 },
    { code: "39", name: "Italy", digits: 10 },
    { code: "34", name: "Spain", digits: 9 },
    { code: "31", name: "Netherlands", digits: 9 },
    { code: "46", name: "Sweden", digits: 9 },
    { code: "47", name: "Norway", digits: 8 },
    { code: "45", name: "Denmark", digits: 8 },
    { code: "358", name: "Finland", digits: 10 },
    { code: "41", name: "Switzerland", digits: 9 },
    { code: "43", name: "Austria", digits: 10 },
    { code: "32", name: "Belgium", digits: 9 },
    { code: "353", name: "Ireland", digits: 9 },
    { code: "351", name: "Portugal", digits: 9 },
    { code: "48", name: "Poland", digits: 9 },
    { code: "86", name: "China", digits: 11 },
    { code: "82", name: "South Korea", digits: 10 },
    { code: "64", name: "New Zealand", digits: 9 },
    { code: "27", name: "South Africa", digits: 9 },
    { code: "20", name: "Egypt", digits: 10 },
    { code: "234", name: "Nigeria", digits: 10 },
    { code: "966", name: "Saudi Arabia", digits: 9 },
    { code: "972", name: "Israel", digits: 9 },
    { code: "90", name: "Turkey", digits: 10 },
    { code: "7", name: "Russia", digits: 10 },
  ];

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", country_code: "", phone_number: "" };

    // Name validation
    if (!leadData.name || leadData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
      valid = false;
      if (nameRef.current) nameRef.current.focus();
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!leadData.email || !emailRegex.test(leadData.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
      if (valid && emailRef.current) emailRef.current.focus();
    }

    // Country code validation
    if (!leadData.country_code) {
      newErrors.country_code = "Please select a country code.";
      valid = false;
      if (valid && countryCodeRef.current) countryCodeRef.current.focus();
    }

    // WhatsApp number validation
    if (!leadData.phone_number) {
      newErrors.phone_number = "WhatsApp number is required.";
      valid = false;
      if (valid && phoneRef.current) phoneRef.current.focus();
    } else if (leadData.country_code) {
      const selectedCountry = countryOptions.find(
        (country) => country.code === leadData.country_code
      );
      if (selectedCountry) {
        // Remove any non-digit characters for validation
        const cleanPhone = leadData.phone_number.replace(/\D/g, "");
        const phoneRegex = new RegExp(`^[0-9]{${selectedCountry.digits}}$`);
        if (!phoneRegex.test(cleanPhone)) {
          newErrors.phone_number = `Please enter a valid ${selectedCountry.digits}-digit WhatsApp number for ${selectedCountry.name}.`;
          valid = false;
          if (valid && phoneRef.current) phoneRef.current.focus();
        }
      }
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        if (onClose) {
          onClose(false); // false indicates closed without submitting
        }
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleClose = () => {
    if (onClose) {
      onClose(false); // false indicates closed without submitting
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validateForm()) { trackEvent("form_error", {form_id: "coach_match", error_type: "validation"}); return; }

    setLoading(true);
    try {
      // Combine country code and WhatsApp number in the format "+{code} {phone}"
      const cleanPhone = leadData.phone_number.replace(/\D/g, "");
      const phoneWithCountryCode = `+${leadData.country_code} ${cleanPhone}`;

      // Create payload with combined WhatsApp number (excluding separate country_code)
      const { country_code, ...restData } = leadData;
      const payload = {
        ...restData,
        phone_number: phoneWithCountryCode,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin_functions/capture-lead/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to capture lead");
      }

      const data = await response.json();
      if (import.meta.env.DEV) {
        console.log(`Lead captured successfully! Welcome ${data.name}`);
      }

      // Save lead data for auto-filling the payment form later
      sessionStorage.setItem("capturedLead", JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone_number: cleanPhone,
        country_code: country_code,
      }));

      trackEvent("generate_lead", {form_id: "coach_match"});
      onSubmit();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error:", error);
      }
      trackEvent("form_error", {form_id: "coach_match", error_type: "submission"});
      setErrors(prev => ({ ...prev, submit: "Something went wrong. Please try again later." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leadcap__container">
      <div className="leadcap__content" ref={contentRef}>
        <button
          type="button"
          className="leadcap__close-btn"
          onClick={handleClose}
          aria-label="Close form"
        >
          ×
        </button>
        <div className="leadcap__img">
          <div className="leadcap__det">
            <div className="leadcap__det-logo">
              <img src={Logo} alt="Logo" className="leadcap__logo-main" />
            </div>
            <div className="leadcap__det-head">
              <p>
                We found {coachCount} coach{coachCount !== 1 ? "es" : ""} perfect
                for you
              </p>
            </div>
            <div className="leadcap__det-tag">
              <p>View your matches by filling the form</p>
            </div>
          </div>
        </div>
        <div className="leadcap__form">
          <form data-clarity-mask="true" onSubmit={handleSubmit}>
            <div className="leadcap__form-field">
              <label htmlFor="name">
                Name<sup style={{ color: "red" }}>*</sup>
              </label>
              <input
                ref={nameRef}
                type="text"
                placeholder="Enter your name"
                className="unstyled-inputs"
                value={leadData.name}
                onChange={(e) =>
                  setLeadData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              {errors.name && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontFamily: "Montserrat",
                    margin: "0",
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>
            <div className="leadcap__form-field">
              <label htmlFor="email">
                Email<sup style={{ color: "red" }}>*</sup>
              </label>
              <input
                ref={emailRef}
                type="email"
                placeholder="Enter your email"
                className="unstyled-inputs"
                value={leadData.email}
                onChange={(e) =>
                  setLeadData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              {errors.email && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontFamily: "Montserrat",
                    margin: "0",
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>
            <div className="leadcap__form-field">
              <label htmlFor="country_code">
                Country Code<sup style={{ color: "red" }}>*</sup>
              </label>
              <select
                ref={countryCodeRef}
                id="country_code"
                className="unstyled-inputs"
                value={leadData.country_code || ""}
                onChange={(e) => {
                  setLeadData((prev) => ({
                    ...prev,
                    country_code: e.target.value,
                  }));
                  // Clear error while selecting
                  if (errors.country_code) {
                    setErrors((prev) => ({ ...prev, country_code: "" }));
                  }
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <option value="">Select country code</option>
                {countryOptions.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} (+{country.code})
                  </option>
                ))}
              </select>
              {errors.country_code && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontFamily: "Montserrat",
                    margin: "0",
                  }}
                >
                  {errors.country_code}
                </p>
              )}
            </div>
            <div className="leadcap__form-field">
              <label htmlFor="phone_number">
                WhatsApp Number<sup style={{ color: "red" }}>*</sup>
              </label>
              <input
                ref={phoneRef}
                type="tel"
                id="phone_number"
                placeholder="Enter WhatsApp number (without country code)"
                className="unstyled-inputs"
                value={leadData.phone_number || ""}
                onChange={(e) => {
                  // Remove any non-digit characters
                  const cleanPhone = e.target.value.replace(/\D/g, "");
                  setLeadData((prev) => ({
                    ...prev,
                    phone_number: cleanPhone,
                  }));
                  // Clear error while typing
                  if (errors.phone_number) {
                    setErrors((prev) => ({ ...prev, phone_number: "" }));
                  }
                }}
              />
              {errors.phone_number && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontFamily: "Montserrat",
                    margin: "0",
                  }}
                >
                  {errors.phone_number}
                </p>
              )}
            </div>
            <div className="leadcap__btn-sec">
              {errors.submit && (
                <p style={{ color: "red", fontSize: "12px", fontFamily: "Montserrat", margin: "0 0 8px 0", textAlign: "center" }}>
                  {errors.submit}
                </p>
              )}
              <button
                type="submit"
                className="leadcap__btn"
                disabled={loading}
                aria-disabled={loading}
                style={{
                  pointerEvents: loading ? "none" : "auto",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  border: "none",
                  width: "100%",
                }}
              >
                <p>{loading ? "Submitting..." : "Reveal My Matches"}</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadCapture;
