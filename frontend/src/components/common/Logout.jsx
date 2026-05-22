// src/components/common/AuthButton.jsx
import { useNavigate, useLocation } from "react-router-dom";

const AuthButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Redirect to login, but remember where they were (optional)
    navigate("/login", { state: { from: location } });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (token) {
    // LOGOUT BUTTON
    return (
      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "10px",
          padding: "8px 16px",
          color: "#ef4444",
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239,68,68,0.15)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(239,68,68,0.08)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <span style={{ fontSize: "15px" }}>→</span>
        Logout
      </button>
    );
  }

  // LOGIN BUTTON
  return (
    <button
      onClick={handleLogin}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        border: "none",
        borderRadius: "10px",
        padding: "9px 18px",
        color: "#fff",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(99,102,241,0.3)";
      }}
    >
      <span style={{ fontSize: "15px" }}>→</span>
      Login
    </button>
  );
};

export default AuthButton;