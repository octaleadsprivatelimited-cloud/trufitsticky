import { useRouteError, useNavigate } from "react-router-dom";
import Logo from "../assets/footer-logo.svg";
import LogoText from "../assets/footer-logo-text.svg";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Check if it's a CSS preload error (non-critical)
  const isCssPreloadError = error?.message?.includes("preload CSS") || 
                           error?.message?.includes("Unable to preload");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#efefef",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "40px",
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "50px", height: "50px" }} />
        <img
          src={LogoText}
          alt="LogoText"
          style={{ width: "150px", height: "50px" }}
        />
      </div>

      <h1
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "32px",
          fontWeight: 600,
          color: "#333",
          margin: "0 0 20px 0",
        }}
      >
        {isCssPreloadError ? "Loading..." : "Something went wrong"}
      </h1>

      {!isCssPreloadError && (
        <p
          style={{
            color: "#666",
            fontFamily: "Open Sans, sans-serif",
            fontSize: "16px",
            margin: "0 0 30px 0",
            maxWidth: "500px",
          }}
        >
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
      )}

      {isCssPreloadError && (
        <p
          style={{
            color: "#666",
            fontFamily: "Open Sans, sans-serif",
            fontSize: "16px",
            margin: "0 0 30px 0",
            maxWidth: "500px",
          }}
        >
          The page is loading. If it doesn't appear, please try refreshing.
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleRetry}
          style={{
            padding: "12px 24px",
            backgroundColor: "#9c27ff",
            color: "white",
            border: "none",
            borderRadius: "24px",
            cursor: "pointer",
            fontFamily: "Darker Grotesque, sans-serif",
            fontSize: "16px",
            fontWeight: 500,
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Retry
        </button>
        <button
          onClick={handleGoHome}
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            color: "#333",
            border: "1px solid #333",
            borderRadius: "24px",
            cursor: "pointer",
            fontFamily: "Darker Grotesque, sans-serif",
            fontSize: "16px",
            fontWeight: 500,
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Go to Home
        </button>
      </div>

      {import.meta.env.DEV && error && (
        <details
          style={{
            marginTop: "40px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            maxWidth: "600px",
            textAlign: "left",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          <summary style={{ cursor: "pointer", marginBottom: "10px" }}>
            Error Details (Dev Only)
          </summary>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#d32f2f",
            }}
          >
            {JSON.stringify(error, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ErrorPage;

