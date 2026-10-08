import { useRef, useEffect } from "react";
import FooterLogo from "../../assets/footer-logo.svg";
import FooterLogoText from "../../assets/footer-logo-text.svg";
import "./locationPermissionModal.css";

const LocationPermissionModal = ({ onClose, onManualSelect }) => {
  const contentRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="locperm__container">
      <div className="locperm__content" ref={contentRef}>
        <button
          type="button"
          className="locperm__close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <div className="locperm__header">
          <div className="locperm__logo">
            <img src={FooterLogo} alt="TruFit Logo" className="locperm__logo-main" />
            <img src={FooterLogoText} alt="TruFit" className="locperm__logo-text" />
          </div>
        </div>
        <div className="locperm__body">
          <div className="locperm__message">
            <p className="locperm__message-head">Enable Location Access</p>
            <p className="locperm__message-text">
              We couldn't automatically detect your location. Please allow
              location access for accurate pricing and personalized services.
            </p>
          </div>
          <div className="locperm__btn-sec">
            <div
              onClick={onClose}
              className="locperm__btn"
              role="button"
              style={{ cursor: "pointer" }}
            >
              <p>Allow Location</p>
            </div>
          </div>

          {/* Manual fallback */}
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <p
              style={{
                fontFamily: "Open Sans",
                fontSize: "13px",
                color: "#888",
                marginBottom: "10px",
              }}
            >
              Or select your region manually:
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => onManualSelect && onManualSelect("DOMESTIC")}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "2px solid #3399cc",
                  backgroundColor: "#fff",
                  color: "#3399cc",
                  fontFamily: "Open Sans",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#3399cc";
                  e.target.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.color = "#3399cc";
                }}
              >
                🇮🇳 India
              </button>
              <button
                onClick={() => onManualSelect && onManualSelect("INTERNATIONAL")}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "2px solid #3399cc",
                  backgroundColor: "#fff",
                  color: "#3399cc",
                  fontFamily: "Open Sans",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#3399cc";
                  e.target.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.color = "#3399cc";
                }}
              >
                🌎 International
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionModal;
