import Logo from "../assets/footer-logo.svg";
import LogoText from "../assets/footer-logo-text.svg";

// Suspense fallback component with breathing footer logos
const SuspenseFallback = () => (
  <>
    <style>
      {`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .breathing-logo {
          animation: breathe 2s ease-in-out infinite;
        }
      `}
    </style>
    <div 
      style={{ 
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        zIndex: 9999
      }}
    >
      <div 
        className="breathing-logo"
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px" 
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "50px", height: "50px" }} />
        <img src={LogoText} alt="LogoText" style={{ width: "150px", height: "50px" }} />
      </div>
    </div>
  </>
);

export default SuspenseFallback;
