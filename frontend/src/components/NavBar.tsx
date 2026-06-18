import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px",
        borderBottom: "1px solid var(--line)",
        background: "var(--surface)",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "7px",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          T
        </div>
        <span style={{ fontSize: "15px", fontWeight: 600 }}>Triage</span>
      </Link>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <span style={{ fontSize: "13px", color: "var(--ink-soft)" }}>
            {user.name} <span style={{ opacity: 0.6 }}>· {user.role}</span>
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-sm)",
              padding: "6px 14px",
              fontSize: "13px",
              color: "var(--ink-soft)",
            }}
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
};
