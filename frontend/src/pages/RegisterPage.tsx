import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Couldn't create your account. Try a different email."
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
        <h1 style={{ fontSize: "20px", marginBottom: "4px" }}>Create your account</h1>
        <p style={{ fontSize: "13px", color: "var(--ink-soft)", marginBottom: "24px" }}>
          Submit tickets as a customer, or join as a support agent.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 500 }}>Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              style={inputStyle}
            />
          </label>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              style={inputStyle}
            />
          </label>

          <div>
            <span style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "8px" }}>
              I am a
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["customer", "agent"] as UserRole[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1,
                    padding: "9px",
                    borderRadius: "var(--radius-sm)",
                    border: role === r ? "1.5px solid var(--accent)" : "1px solid var(--line)",
                    background: role === r ? "var(--accent-soft)" : "var(--paper)",
                    color: role === r ? "var(--accent)" : "var(--ink-soft)",
                    fontSize: "13px",
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p style={{ fontSize: "13px", color: "var(--urgent)", margin: 0 }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={{ fontSize: "13px", color: "var(--ink-soft)", marginTop: "20px", textAlign: "center" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent)", fontWeight: 500 }}>Log in</Link>
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
