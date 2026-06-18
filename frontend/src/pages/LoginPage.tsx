import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Couldn't log you in. Check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius)",
          padding: "32px 30px",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          T
        </div>
        <h1 style={{ fontSize: "20px", marginBottom: "4px" }}>Log in</h1>
        <p style={{ fontSize: "13px", color: "var(--ink-soft)", marginBottom: "24px" }}>
          Pick up your tickets where you left off.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 500 }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 500 }}>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </label>

          {error && (
            <p style={{ fontSize: "13px", color: "var(--urgent)", margin: 0 }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p style={{ fontSize: "13px", color: "var(--ink-soft)", marginTop: "20px", textAlign: "center" }}>
          No account yet? <Link to="/register" style={{ color: "var(--accent)", fontWeight: 500 }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--line)",
  background: "var(--paper)",
  color: "var(--ink)",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "6px",
  padding: "10px",
  borderRadius: "var(--radius-sm)",
  border: "none",
  background: "var(--accent)",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 600,
};
