import React, { useRef, useState, useEffect, useCallback } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import CardClose from "../../assets/card-close.svg";
import { trackEvent } from "../../analytics/analytics";

const ClientPaymentForm = ({ coachId, coachName, planId, analyticsPlanId, planName, paymentMode, calendlyLink, subscriptionAmount, spurfit_url, onClose }) => {
  const isConsultation = String(planName).toLowerCase().includes("consultation");
  const defaultDialCode = isConsultation ? (paymentMode === "cashfree" ? "91" : "1") : "";
  const [formData, setFormData] = useState(() => {
    const savedLead = sessionStorage.getItem("capturedLead");
    if (savedLead) {
      try {
        const parsed = JSON.parse(savedLead);
        return {
          name: parsed.name || "",
          email: parsed.email || "",
          country_code: parsed.country_code || defaultDialCode,
          phone_number: parsed.phone_number || "",
          residence: "",
          state: "",
          city: "",
        };
      } catch (e) {
        console.error("Failed to parse captured lead", e);
      }
    }
    return {
      name: "",
      email: "",
      country_code: defaultDialCode,
      phone_number: "",
      residence: "",
      state: "",
      city: "",
    };
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    country_code: "",
    phone_number: "",
    residence: "",
    state: "",
    city: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const residenceRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);

  // State Data Structure (city data removed)
  const stateCityData = {
    USA: {
      "Alabama": [],
      "Alaska": [],
      "Arizona": [],
      "Arkansas": [],
      "California": [],
      "Colorado": [],
      "Connecticut": [],
      "Delaware": [],
      "Florida": [],
      "Georgia": [],
      "Hawaii": [],
      "Idaho": [],
      "Illinois": [],
      "Indiana": [],
      "Iowa": [],
      "Kansas": [],
      "Kentucky": [],
      "Louisiana": [],
      "Maine": [],
      "Maryland": [],
      "Massachusetts": [],
      "Michigan": [],
      "Minnesota": [],
      "Mississippi": [],
      "Missouri": [],
      "Montana": [],
      "Nebraska": [],
      "Nevada": [],
      "New Hampshire": [],
      "New Jersey": [],
      "New Mexico": [],
      "New York": [],
      "North Carolina": [],
      "North Dakota": [],
      "Ohio": [],
      "Oklahoma": [],
      "Oregon": [],
      "Pennsylvania": [],
      "Rhode Island": [],
      "South Carolina": [],
      "South Dakota": [],
      "Tennessee": [],
      "Texas": [],
      "Utah": [],
      "Vermont": [],
      "Virginia": [],
      "Washington": [],
      "West Virginia": [],
      "Wisconsin": [],
      "Wyoming": []
    },
    India: {
      "Andhra Pradesh": [],
      "Arunachal Pradesh": [],
      "Assam": [],
      "Bihar": [],
      "Chhattisgarh": [],
      "Goa": [],
      "Gujarat": [],
      "Haryana": [],
      "Himachal Pradesh": [],
      "Jharkhand": [],
      "Karnataka": [],
      "Kerala": [],
      "Madhya Pradesh": [],
      "Maharashtra": [],
      "Manipur": [],
      "Meghalaya": [],
      "Mizoram": [],
      "Nagaland": [],
      "Odisha": [],
      "Punjab": [],
      "Rajasthan": [],
      "Sikkim": [],
      "Tamil Nadu": [],
      "Telangana": [],
      "Tripura": [],
      "Uttar Pradesh": [],
      "Uttarakhand": [],
      "West Bengal": [],
      "Andaman and Nicobar Islands": [],
      "Chandigarh": [],
      "Dadra and Nagar Haveli and Daman and Diu": [],
      "Delhi": [],
      "Jammu and Kashmir": [],
      "Ladakh": [],
      "Lakshadweep": [],
      "Puducherry": []
    },
    UK: {
      "England": [],
      "Scotland": [],
      "Wales": [],
      "Northern Ireland": []
    },
    Canada: {
      "Alberta": [],
      "British Columbia": [],
      "Manitoba": [],
      "New Brunswick": [],
      "Newfoundland and Labrador": [],
      "Northwest Territories": [],
      "Nova Scotia": [],
      "Nunavut": [],
      "Ontario": [],
      "Prince Edward Island": [],
      "Quebec": [],
      "Saskatchewan": [],
      "Yukon": []
    },
    UAE: {
      "Abu Dhabi": [],
      "Dubai": [],
      "Sharjah": [],
      "Ajman": [],
      "Ras Al Khaimah": [],
      "Fujairah": [],
      "Umm Al Quwain": []
    }
  };

  // Helper functions for dynamic labels
  const getStateLabel = (country) => {
    const labels = {
      "USA": "State",
      "India": "State / Union Territory",
      "Canada": "Province / Territory",
      "UAE": "Emirate",
      "UK": "Region / Country",
      "Other": "State"
    };
    return labels[country] || "State";
  };

  const getCityLabel = () => {
    return "City";
  };

  // Handle click outside modal to close - memoized to prevent stale closures
  const handleClickOutside = useCallback((event) => {
    // Prevent event propagation to parent modal
    event.stopPropagation();

    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  }, [onClose]);

  // Add event listener for click outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);


  // Helper functions for state and city
  const getStatesForCountry = (country) => {
    if (!country || country === "Other") return [];
    const countryData = stateCityData[country];
    return countryData ? Object.keys(countryData) : [];
  };

  const isOtherCountry = (country) => {
    return country === "Other";
  };

  // Country code options based on payment mode
  const getCountryOptions = () => {
    const allCountries = [
      { code: "1", name: "United States", digits: 10 },
      { code: "44", name: "United Kingdom", digits: 10 },
      { code: "1", name: "Canada", digits: 10 },
      { code: "61", name: "Australia", digits: 9 },
      { code: "971", name: "United Arab Emirates", digits: 9 },
      { code: "91", name: "India", digits: 10 },
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
      { code: "420", name: "Czech Republic", digits: 9 },
      { code: "36", name: "Hungary", digits: 9 },
      { code: "40", name: "Romania", digits: 9 },
      { code: "359", name: "Bulgaria", digits: 9 },
      { code: "385", name: "Croatia", digits: 9 },
      { code: "421", name: "Slovakia", digits: 9 },
      { code: "386", name: "Slovenia", digits: 8 },
      { code: "372", name: "Estonia", digits: 8 },
      { code: "371", name: "Latvia", digits: 8 },
      { code: "370", name: "Lithuania", digits: 8 },
      { code: "352", name: "Luxembourg", digits: 9 },
      { code: "356", name: "Malta", digits: 8 },
      { code: "357", name: "Cyprus", digits: 8 },
      { code: "30", name: "Greece", digits: 10 },
      { code: "90", name: "Turkey", digits: 10 },
      { code: "7", name: "Russia", digits: 10 },
      { code: "380", name: "Ukraine", digits: 9 },
      { code: "375", name: "Belarus", digits: 9 },
      { code: "373", name: "Moldova", digits: 8 },
      { code: "995", name: "Georgia", digits: 9 },
      { code: "374", name: "Armenia", digits: 8 },
      { code: "994", name: "Azerbaijan", digits: 9 },
      { code: "7", name: "Kazakhstan", digits: 10 },
      { code: "998", name: "Uzbekistan", digits: 9 },
      { code: "996", name: "Kyrgyzstan", digits: 9 },
      { code: "992", name: "Tajikistan", digits: 9 },
      { code: "993", name: "Turkmenistan", digits: 8 },
      { code: "93", name: "Afghanistan", digits: 9 },
      { code: "92", name: "Pakistan", digits: 10 },
      { code: "880", name: "Bangladesh", digits: 10 },
      { code: "94", name: "Sri Lanka", digits: 9 },
      { code: "960", name: "Maldives", digits: 7 },
      { code: "975", name: "Bhutan", digits: 8 },
      { code: "977", name: "Nepal", digits: 10 },
      { code: "95", name: "Myanmar", digits: 9 },
      { code: "856", name: "Laos", digits: 10 },
      { code: "855", name: "Cambodia", digits: 9 },
      { code: "84", name: "Vietnam", digits: 9 },
      { code: "86", name: "China", digits: 11 },
      { code: "886", name: "Taiwan", digits: 9 },
      { code: "852", name: "Hong Kong", digits: 8 },
      { code: "853", name: "Macau", digits: 8 },
      { code: "82", name: "South Korea", digits: 10 },
      { code: "850", name: "North Korea", digits: 10 },
      { code: "976", name: "Mongolia", digits: 8 },
      { code: "64", name: "New Zealand", digits: 9 },
      { code: "679", name: "Fiji", digits: 8 },
      { code: "675", name: "Papua New Guinea", digits: 8 },
      { code: "677", name: "Solomon Islands", digits: 7 },
      { code: "678", name: "Vanuatu", digits: 7 },
      { code: "687", name: "New Caledonia", digits: 8 },
      { code: "689", name: "French Polynesia", digits: 8 },
      { code: "685", name: "Samoa", digits: 7 },
      { code: "676", name: "Tonga", digits: 7 },
      { code: "686", name: "Kiribati", digits: 8 },
      { code: "688", name: "Tuvalu", digits: 6 },
      { code: "674", name: "Nauru", digits: 7 },
      { code: "680", name: "Palau", digits: 7 },
      { code: "692", name: "Marshall Islands", digits: 7 },
      { code: "691", name: "Micronesia", digits: 7 },
      { code: "1", name: "American Samoa", digits: 10 },
      { code: "1", name: "Guam", digits: 10 },
      { code: "1", name: "Northern Mariana Islands", digits: 10 },
      { code: "1", name: "U.S. Virgin Islands", digits: 10 },
      { code: "1", name: "Puerto Rico", digits: 10 },
      { code: "1", name: "Dominican Republic", digits: 10 },
      { code: "53", name: "Cuba", digits: 8 },
      { code: "1", name: "Jamaica", digits: 10 },
      { code: "509", name: "Haiti", digits: 8 },
      { code: "1", name: "Bahamas", digits: 10 },
      { code: "1", name: "Barbados", digits: 10 },
      { code: "1", name: "Trinidad and Tobago", digits: 10 },
      { code: "1", name: "Grenada", digits: 10 },
      { code: "1", name: "Saint Lucia", digits: 10 },
      { code: "1", name: "Saint Vincent and the Grenadines", digits: 10 },
      { code: "1", name: "Antigua and Barbuda", digits: 10 },
      { code: "1", name: "Saint Kitts and Nevis", digits: 10 },
      { code: "1", name: "Dominica", digits: 10 },
      { code: "54", name: "Argentina", digits: 10 },
      { code: "591", name: "Bolivia", digits: 8 },
      { code: "56", name: "Chile", digits: 9 },
      { code: "57", name: "Colombia", digits: 10 },
      { code: "593", name: "Ecuador", digits: 9 },
      { code: "592", name: "Guyana", digits: 7 },
      { code: "595", name: "Paraguay", digits: 9 },
      { code: "51", name: "Peru", digits: 9 },
      { code: "597", name: "Suriname", digits: 7 },
      { code: "598", name: "Uruguay", digits: 8 },
      { code: "58", name: "Venezuela", digits: 10 },
      { code: "27", name: "South Africa", digits: 9 },
      { code: "20", name: "Egypt", digits: 10 },
      { code: "234", name: "Nigeria", digits: 10 },
      { code: "254", name: "Kenya", digits: 9 },
      { code: "256", name: "Uganda", digits: 9 },
      { code: "255", name: "Tanzania", digits: 9 },
      { code: "251", name: "Ethiopia", digits: 9 },
      { code: "233", name: "Ghana", digits: 9 },
      { code: "225", name: "Côte d'Ivoire", digits: 10 },
      { code: "221", name: "Senegal", digits: 9 },
      { code: "223", name: "Mali", digits: 8 },
      { code: "226", name: "Burkina Faso", digits: 8 },
      { code: "227", name: "Niger", digits: 8 },
      { code: "235", name: "Chad", digits: 8 },
      { code: "249", name: "Sudan", digits: 9 },
      { code: "211", name: "South Sudan", digits: 9 },
      { code: "291", name: "Eritrea", digits: 7 },
      { code: "253", name: "Djibouti", digits: 8 },
      { code: "252", name: "Somalia", digits: 8 },
      { code: "269", name: "Comoros", digits: 7 },
      { code: "261", name: "Madagascar", digits: 9 },
      { code: "230", name: "Mauritius", digits: 8 },
      { code: "248", name: "Seychelles", digits: 7 },
      { code: "262", name: "Réunion", digits: 9 },
      { code: "262", name: "Mayotte", digits: 9 },
      { code: "258", name: "Mozambique", digits: 9 },
      { code: "265", name: "Malawi", digits: 9 },
      { code: "260", name: "Zambia", digits: 9 },
      { code: "263", name: "Zimbabwe", digits: 9 },
      { code: "267", name: "Botswana", digits: 8 },
      { code: "264", name: "Namibia", digits: 9 },
      { code: "268", name: "Eswatini", digits: 8 },
      { code: "266", name: "Lesotho", digits: 8 },
      { code: "244", name: "Angola", digits: 9 },
      { code: "243", name: "Democratic Republic of the Congo", digits: 9 },
      { code: "242", name: "Republic of the Congo", digits: 9 },
      { code: "237", name: "Cameroon", digits: 9 },
      { code: "236", name: "Central African Republic", digits: 8 },
      { code: "240", name: "Equatorial Guinea", digits: 9 },
      { code: "241", name: "Gabon", digits: 8 },
      { code: "239", name: "São Tomé and Príncipe", digits: 7 },
      { code: "238", name: "Cape Verde", digits: 7 },
      { code: "245", name: "Guinea-Bissau", digits: 7 },
      { code: "224", name: "Guinea", digits: 9 },
      { code: "232", name: "Sierra Leone", digits: 8 },
      { code: "231", name: "Liberia", digits: 8 },
      { code: "228", name: "Togo", digits: 8 },
      { code: "229", name: "Benin", digits: 8 },
      { code: "250", name: "Rwanda", digits: 9 },
      { code: "257", name: "Burundi", digits: 9 },
      { code: "218", name: "Libya", digits: 9 },
      { code: "216", name: "Tunisia", digits: 8 },
      { code: "213", name: "Algeria", digits: 9 },
      { code: "212", name: "Morocco", digits: 9 },
      { code: "212", name: "Western Sahara", digits: 9 },
      { code: "222", name: "Mauritania", digits: 8 },
      { code: "966", name: "Saudi Arabia", digits: 9 },
      { code: "967", name: "Yemen", digits: 9 },
      { code: "968", name: "Oman", digits: 8 },
      { code: "974", name: "Qatar", digits: 8 },
      { code: "973", name: "Bahrain", digits: 8 },
      { code: "965", name: "Kuwait", digits: 8 },
      { code: "964", name: "Iraq", digits: 10 },
      { code: "98", name: "Iran", digits: 10 },
      { code: "972", name: "Israel", digits: 9 },
      { code: "970", name: "Palestine", digits: 9 },
      { code: "962", name: "Jordan", digits: 9 },
      { code: "961", name: "Lebanon", digits: 8 },
      { code: "963", name: "Syria", digits: 9 },
    ];

    if (paymentMode === "cashfree") {
      // Only India for Cashfree
      return allCountries.filter(country => country.code === "91");
    } else if (paymentMode === "razorpay") {
      // USA, Great Britain, Canada, Australia, UAE first, then rest
      const preferredCountries = ["1", "44", "1", "61", "971"]; // US, GB, CA, AU, UAE
      const preferred = allCountries.filter(country => preferredCountries.includes(country.code));
      const rest = allCountries.filter(country => !preferredCountries.includes(country.code));
      return [...preferred, ...rest];
    }

    return allCountries;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If WhatsApp number is being entered, ensure it doesn't include country code
    if (name === "phone_number") {
      // Remove any non-digit characters and ensure it's just the WhatsApp number
      const cleanPhone = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: cleanPhone });
    } else if (name === "residence") {
      // When country changes, reset state and city
      setFormData({
        ...formData,
        [name]: value,
        state: "",
        city: ""
      });
    } else if (name === "state") {
      // When state changes, reset city
      setFormData({
        ...formData,
        [name]: value,
        city: ""
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: "" }); // clear error while typing
  };

  // Function to build redirect URL with form data
  const buildRedirectUrl = (formData, planName, subscriptionAmount) => {
    if (!spurfit_url) return null;
    const baseUrl = spurfit_url;

    const params = new URLSearchParams({
      email: formData.email || '',
      name: formData.name || '',
      phone: `+${formData.country_code} ${formData.phone_number}`,
      subscriptionName: planName || '',
      subscriptionAmount: subscriptionAmount || ''
    });

    // Fix: Ensure proper URL separator (? or &)
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}${params.toString()}`;
  };

  // ✅ Validation Function
  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", country_code: "", phone_number: "", residence: "", state: "", city: "", subscription_amount: "" };

    // Name validation
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Full Name must be at least 3 characters long.";
      valid = false;
      if (nameRef.current) nameRef.current.focus();
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
      if (valid && emailRef.current) emailRef.current.focus();
    }

    // Country code validation
    if (!formData.country_code) {
      newErrors.country_code = "Please select a country code.";
      valid = false;
    }

    // Phone validation based on selected country
    if (!formData.phone_number) {
      newErrors.phone_number = "WhatsApp number is required.";
      valid = false;
    } else if (formData.country_code) {
      const selectedCountry = getCountryOptions().find(country => country.code === formData.country_code);
      if (selectedCountry) {
        const phoneRegex = new RegExp(`^[0-9]{${selectedCountry.digits}}$`);
        if (!phoneRegex.test(formData.phone_number)) {
          newErrors.phone_number = `Please enter a valid ${selectedCountry.digits}-digit WhatsApp number for ${selectedCountry.name}.`;
          valid = false;
          if (valid && phoneRef.current) phoneRef.current.focus();
        }
      }
    }

    // Residence validation
    if (!formData.residence || formData.residence.trim().length < 2) {
      newErrors.residence = "Please select a country.";
      valid = false;
      if (valid && residenceRef.current) residenceRef.current.focus();
    }

    // State validation - cannot be empty
    if (!formData.state || formData.state.trim().length === 0) {
      newErrors.state = "State is required.";
      valid = false;
      if (valid && stateRef.current) stateRef.current.focus();
    }

    // City validation - cannot be empty
    if (!formData.city || formData.city.trim().length === 0) {
      newErrors.city = "City is required.";
      valid = false;
      if (valid && cityRef.current) cityRef.current.focus();
    }

    setErrors(newErrors);
    return valid;
  };

  // 🔑 Load Razorpay SDK (idempotent — won't load twice)
  const loadRazorpayScript = () => {
    if (window.Razorpay) return Promise.resolve(true);
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (window.Razorpay) { clearInterval(check); resolve(true); }
        }, 100);
        setTimeout(() => { clearInterval(check); resolve(false); }, 10000);
      });
    }
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🔑 Load Cashfree SDK (idempotent — won't load twice)
  const loadCashfreeScript = () => {
    if (window.Cashfree) return Promise.resolve(true);
    if (document.querySelector('script[src*="sdk.cashfree.com"]')) {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (window.Cashfree) { clearInterval(check); resolve(true); }
        }, 100);
        setTimeout(() => { clearInterval(check); resolve(false); }, 10000);
      });
    }
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🔑 Cashfree: Poll order status with retry (for ACTIVE orders that haven't completed yet)
  const pollCashfreeOrderStatus = async (clientId, orderId, maxAttempts = 5) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin_functions/order-status-check/${clientId}/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: orderId }),
          }
        );
        const data = await res.json();

        // Normalize: Cashfree API returns order_status: "PAID" (uppercase)
        // Backend might wrap as: status, order_status, paid, payment_status
        const isPaid =
          data.order_status === "PAID" ||
          data.status === "PAID" ||
          data.status === "paid" ||
          data.paid === true ||
          data.payment_status === "SUCCESS";

        const isExpired =
          data.order_status === "EXPIRED" ||
          data.status === "expired" ||
          data.expired === true;

        if (isPaid) return { verified: true, data };
        if (isExpired) return { verified: false, expired: true, data };

        // Still ACTIVE — wait and retry
        if (attempt < maxAttempts) {
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error(`Poll attempt ${attempt} failed:`, err);
        }
        if (attempt === maxAttempts) throw err;
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    return { verified: false, timeout: true };
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validateForm()) {
      trackEvent("form_error", { coach_id: String(coachId), coach_name: coachName, form_id: "coach_enrollment", error_type: "validation" });
      return;
    }

    setSubmitting(true);

    try {
      // STEP 1: Submit client details
      const buyNowUrl =
        paymentMode === "razorpay"
          ? `${import.meta.env.VITE_BASE_URL}/admin_functions/int-buy-now/`
          : `${import.meta.env.VITE_BASE_URL}/admin_functions/ind-buy-now/`;

      const payload = {
        name: formData.name,
        email: formData.email,
        country_code: formData.country_code,
        phone_number: `+${formData.country_code} ${formData.phone_number}`,
        residence: formData.residence,
        state: formData.state,
        city: formData.city,
        subscription_amount: subscriptionAmount,
        coach: coachId,
        plan: planId,
        payment_mode: paymentMode,
      };


      const clientRes = await fetch(buyNowUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const clientData = await clientRes.json();
      if (!clientRes.ok)
        throw new Error(clientData?.detail || "Failed to create client.");

      trackEvent("generate_lead", { coach_id: String(coachId), coach_name: coachName, form_id: "coach_enrollment", plan_id: String(analyticsPlanId || planId), plan_type: planName === "Consultation Call" ? "consultation" : "individual" });
      const clientId = clientData.id;

      // -------------------------
      // 🔹 CASE 1: Razorpay flow with 3DS handling
      // -------------------------
      if (paymentMode === "razorpay") {
        const razorpayRes = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin_functions/int-payment-init/${clientId}/`,
          { method: "POST", headers: { "Content-Type": "application/json" } }
        );

        const razorpayData = await razorpayRes.json();
        if (!razorpayRes.ok)
          throw new Error("Failed to initiate Razorpay payment.");

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setErrors(prev => ({ ...prev, submit: "Razorpay SDK failed to load. Please check your internet connection and try again." }));
          setSubmitting(false);
          return;
        }

        // ✅ Store payment context BEFORE opening Razorpay (for redirect fallback)
        localStorage.setItem(`payment_context_${clientId}`, JSON.stringify({
          clientId: clientId,
          orderId: razorpayData.razorpay_order_id,
          planName: planName,
          calendlyLink: planName.toLowerCase().includes("consultation call") ? calendlyLink : null,
          spurfitUrl: !planName.toLowerCase().includes("consultation call")
            ? buildRedirectUrl(formData, planName, subscriptionAmount)
            : null,
          timestamp: Date.now(),
        }));

        const options = {
          key: razorpayData.key,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
          name: "Tru-Fit",
          description: `Payment for ${planName}`,
          order_id: razorpayData.razorpay_order_id,

          // Redirect mode: after payment (success or failure), Razorpay POSTs
          // to the backend callback_url. The backend verifies and redirects
          // back to the frontend with GET query parameters.
          callback_url: new URL(`${import.meta.env.VITE_BASE_URL}/admin_functions/razorpay-callback/?client_id=${clientId}`, window.location.origin).href,
          redirect: true,

          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone_number,
          },
          theme: { color: "#3399cc" },
        };

        const razorpayInstance = new window.Razorpay(options);

        try {
          razorpayInstance.open();
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error("Razorpay checkout failed to open:", error);
          }
          setErrors(prev => ({ ...prev, submit: "Payment gateway failed to load. Please try again." }));
          setSubmitting(false);
        }
      }

      // -------------------------
      // 🔹 CASE 2: Cashfree flow
      // -------------------------
      else if (paymentMode === "cashfree") {
        const cfRes = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin_functions/ind-payment-init/${clientId}/`,
          { method: "POST", headers: { "Content-Type": "application/json" } }
        );

        const cfData = await cfRes.json();
        if (!cfRes.ok) throw new Error("Failed to initiate Cashfree payment.");

        const scriptLoaded = await loadCashfreeScript();
        if (!scriptLoaded || !window.Cashfree) {
          setErrors(prev => ({ ...prev, submit: "Cashfree SDK failed to load. Please check your internet connection and try again." }));
          setSubmitting(false);
          return;
        }

        // ✅ Auto-detect sandbox vs production from backend response
        const cfMode = cfData.app_id?.startsWith("TEST") ? "sandbox" : "production";
        const cashfree = new window.Cashfree({
          mode: cfMode,
        });

        if (import.meta.env.DEV) {
          console.log(`Cashfree SDK initialized in ${cfMode} mode`);
        }

        const options = {
          paymentSessionId: cfData.payment_session_id,
          redirectTarget: "_self", // ✅ Force redirect for robustness (no _modal issues on iOS)
        };

        // ✅ Store payment context for Cashfree redirect fallback
        localStorage.setItem(`payment_context_${clientId}`, JSON.stringify({
          clientId: clientId,
          orderId: cfData.order_id || cfData.payment_session_id, // CF usually uses order_id
          planName: planName,
          calendlyLink: planName.toLowerCase().includes("consultation call") ? calendlyLink : null,
          spurfitUrl: !planName.toLowerCase().includes("consultation call")
            ? buildRedirectUrl(formData, planName, subscriptionAmount)
            : null,
          timestamp: Date.now(),
        }));

        try {
          const res = await cashfree.checkout(options);

          if (import.meta.env.DEV) {
            console.log("Cashfree checkout result:", res);
          }

          // ❌ Cashfree returned an error
          if (res.error) {
            if (import.meta.env.DEV) {
              console.error("Cashfree checkout error:", res.error);
            }
            // Extract meaningful error message
            const errorMsg = res.error?.message || res.error?.description || "Payment failed.";
            setErrors(prev => ({ ...prev, submit: `Payment failed: ${errorMsg}` }));
            setSubmitting(false);
            return;
          }

          // ✅ Cashfree modal closed with "Payment finished" — verify on server
          if (
            res.paymentDetails?.paymentMessage === "Payment finished. Check status." ||
            res.paymentDetails?.paymentMessage?.includes("Payment finished")
          ) {
            try {
              // Poll with retries (order may still be ACTIVE for a few seconds)
              const pollResult = await pollCashfreeOrderStatus(clientId, cfData.order_id || cfData.payment_session_id, 5);

              if (pollResult.verified) {
                if (import.meta.env.DEV) {
                  console.log("Cashfree payment verified:", pollResult.data);
                }

                // Option 1: Clear data upon Payment Success
                sessionStorage.removeItem("capturedLead");

                // ✅ Payment confirmed — redirect
                if (planName.toLowerCase().includes("consultation call")) {
                  window.location.href = calendlyLink || "/payment/success?status=paid";
                } else {
                  const redirectUrl = buildRedirectUrl(formData, planName, subscriptionAmount);
                  window.location.href = redirectUrl || "/payment/success?status=paid";
                }
                return; // Don't cleanup form — we're redirecting
              } else if (pollResult.expired) {
                setErrors(prev => ({ ...prev, submit: "Payment session expired. Please try again." }));
              } else if (pollResult.timeout) {
                setErrors(prev => ({ ...prev, submit: "Payment is being processed. You will receive a confirmation email if successful. Please contact support if charged." }));
              } else {
                setErrors(prev => ({ ...prev, submit: "Payment could not be verified. If you were charged, please contact support." }));
              }
            } catch (verifyErr) {
              if (import.meta.env.DEV) {
                console.error("Cashfree verification error:", verifyErr);
              }
              setErrors(prev => ({ ...prev, submit: "Unable to verify payment. If you were charged, please contact support." }));
            }
            setSubmitting(false);
          } else if (res.paymentDetails) {
            // Payment modal closed with a different message
            const msg = res.paymentDetails?.paymentMessage || res.paymentMessage || "";
            setErrors(prev => ({ ...prev, submit: `Payment not completed: ${msg || "User cancelled or payment failed. Please try again."}` }));
            setSubmitting(false);
          } else {
            // Modal was closed without completing payment
            setErrors(prev => ({ ...prev, submit: "Payment was cancelled. Please try again." }));
            setSubmitting(false);
          }
        } catch (checkoutErr) {
          // ✅ Catch Cashfree SDK checkout promise rejection
          if (import.meta.env.DEV) {
            console.error("Cashfree checkout exception:", checkoutErr);
          }
          setErrors(prev => ({ ...prev, submit: "Payment could not be processed. Please try again or contact support." }));
          setSubmitting(false);
        }
      }
    } catch (error) {
      trackEvent("form_error", { coach_id: String(coachId), coach_name: coachName, form_id: "coach_enrollment", error_type: "submission" });
      if (import.meta.env.DEV) {
        console.error("Payment error:", error);
      }
      setErrors(prev => ({ ...prev, submit: error.message || "Something went wrong. Please try again." }));
      setFormData({
        name: "",
        email: "",
        country_code: "",
        phone_number: "",
        residence: "",
        state: "",
        city: ""
      })
      setSubmitting(false);
    }
  };






  return (
    <div className="client__form__section">
      <div className="client__form__container" ref={modalRef}>
        {/* Close Button */}
        <div className="client__form__head">
          <img
            src={CardClose}
            alt="Close"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="client__form__head-title">
          <h2>{isConsultation ? "Book your consultation" : "Complete your enrollment"}</h2>
          <p>{isConsultation ? `20 minutes with ${coachName}. Complete your details to continue to secure payment.` : "Fill in your details to continue to secure payment."}</p>
        </div>

        <form data-clarity-mask="true" data-form-id="coach_enrollment" onSubmit={handleSubmit}>
          <div className="client__form__content">
            <div className="client__form__inp-field">
              <label htmlFor="name">Full Name<sup style={{ color: "red" }}>*</sup></label>
              <input type="text" id="name" name="name" placeholder="Enter your full name" className="unstyled-inputs" value={formData.name} onChange={handleChange} required />
              {errors.name && <p style={{ color: "red", fontSize: "12px", margin: "0", fontFamily: "Montserrat" }}>{errors.name}</p>}
            </div>

            <div className="client__form__inp-field">
              <label htmlFor="email">Email<sup style={{ color: "red" }}>*</sup></label>
              <input type="email" id="email" name="email" placeholder="Enter your email" className="unstyled-inputs" value={formData.email} onChange={handleChange} required />
              {errors.email && <p style={{ color: "red", fontSize: "12px", margin: "0", fontFamily: "Montserrat" }}>{errors.email}</p>}
            </div>

            {!isConsultation && <>
            <div className="client__form__inp-field">
              <label htmlFor="country_code">Country Code<sup style={{ color: "red" }}>*</sup></label>
              <select
                id="country_code"
                name="country_code"
                className="unstyled-inputs"
                value={formData.country_code}
                onChange={handleChange}
                required
              >
                <option value="">Select Country</option>
                {getCountryOptions().map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name} (+{country.code})
                  </option>
                ))}
              </select>
              {errors.country_code && <p style={{ color: "red", fontSize: "12px", margin: "0", fontFamily: "Montserrat" }}>{errors.country_code}</p>}
            </div>

            </>}
            <div className="client__form__inp-field">
              <label htmlFor="phone_number">WhatsApp Number<sup style={{ color: "red" }}>*</sup></label>
              {isConsultation ? <PhoneInput defaultCountry={paymentMode === 'cashfree' ? 'in' : 'us'} value={`+${formData.country_code}${formData.phone_number}`} preferredCountries={['in','us','gb','ca','ae','au']} charAfterDialCode=" " onChange={(value, meta) => {
                const digits = value.replace(/\D/g, '');
                const dialCode = meta.country.dialCode;
                setFormData(prev => ({...prev, country_code: dialCode, phone_number: digits.slice(dialCode.length)}));
                setErrors(prev => ({...prev, country_code: '', phone_number: ''}));
              }} inputProps={{id:'phone_number',name:'phone_number',required:true,autoComplete:'tel','aria-invalid':Boolean(errors.phone_number || errors.country_code)}}/> : <input type="tel" id="phone_number" name="phone_number" placeholder="Enter WhatsApp number (without country code)" className="unstyled-inputs" value={formData.phone_number} onChange={handleChange} required />}
              {isConsultation && errors.country_code && <p className="consultation-phone-error">{errors.country_code}</p>}
              {errors.phone_number && <p style={{ color: "red", fontSize: "12px", margin: "0", fontFamily: "Montserrat" }}>{errors.phone_number}</p>}
            </div>

            {!isConsultation && <>
            <div className="client__form__inp-field">
              <label htmlFor="coach">Coach</label>
              <input type="text" id="coach" name="coach" value={coachName} disabled className="unstyled-inputs" />
              <input type="hidden" name="coach" value={coachId} />
            </div>

            </>}
            <div className="client__form__inp-field">
              <label htmlFor="residence">Country<sup style={{ color: "red" }}>*</sup></label>
              <select
                id="residence"
                name="residence"
                className="unstyled-inputs"
                value={formData.residence}
                onChange={handleChange}
                required
              >
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="India">India</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="UAE">UAE</option>
                <option value="Other">Other</option>
              </select>
              {errors.residence && <p style={{ color: "red", fontSize: "12px", margin: "0", fontFamily: "Montserrat" }}>{errors.residence}</p>}
            </div>

            <div className="client__form__inp-field">
              <label htmlFor="state">{getStateLabel(formData.residence)}<sup style={{ color: "red" }}>*</sup></label>
              {isOtherCountry(formData.residence) ? (
                <input
                  type="text"
                  id="state"
                  name="state"
                  ref={stateRef}
                  placeholder={`Enter ${getStateLabel(formData.residence).toLowerCase()}`}
                  className="unstyled-inputs"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              ) : (
                <select
                  id="state"
                  name="state"
                  ref={stateRef}
                  className="unstyled-inputs"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select {getStateLabel(formData.residence)}</option>
                  {getStatesForCountry(formData.residence).map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              )}
              {errors.state && <p style={{ color: "red", fontSize: "12px", margin: "0", fontFamily: "Montserrat" }}>{errors.state}</p>}
            </div>

            <div className="client__form__inp-field">
              <label htmlFor="city">{getCityLabel()}<sup style={{ color: "red" }}>*</sup></label>
              <input
                type="text"
                id="city"
                name="city"
                ref={cityRef}
                placeholder="Enter city"
                className="unstyled-inputs"
                value={formData.city}
                onChange={handleChange}
                required
              />
              {errors.city && <p style={{ color: "red", fontSize: "12px", margin: "0", fontFamily: "Montserrat" }}>{errors.city}</p>}
            </div>

            {/* <div className="client__form__inp-field">
              <label htmlFor="payment_mode">Payment Mode</label>
              <input type="text" id="payment_mode" name="payment_mode" value={paymentMode} disabled className="unstyled-inputs"/>
            </div> */}

            <div className="client__form__inp-field">
              <label htmlFor="plan">Plan</label>
              <input type="text" id="plan" name="plan" value={planName} disabled className="unstyled-inputs" />
              <input type="hidden" name="plan" value={planId} />
            </div>

            <div className="client__form__inp-field">
              <label htmlFor="subscription_amount">Subscription Amount<sup style={{ color: "red" }}>*</sup></label>
              <input
                type="text"
                id="subscription_amount"
                name="subscription_amount"
                className="unstyled-inputs"
                value={subscriptionAmount || ""}
                disabled
              />
            </div>
          </div>


          {/* Payment Error Display */}
          {errors.submit && (
            <div style={{
              padding: "12px 16px",
              marginBottom: "16px",
              borderRadius: "8px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              fontSize: "14px",
              fontFamily: "Montserrat, sans-serif",
              lineHeight: "1.5"
            }}>
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            className="client__form__sbt-btn"
            disabled={submitting}
            aria-disabled={submitting}
            style={{
              pointerEvents: submitting ? "none" : "auto",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
              border: "none",
              width: "100%",
            }}
          >
            {submitting ? <p>Paying...</p> : <p>Pay Now</p>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientPaymentForm;
