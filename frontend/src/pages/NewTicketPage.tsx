import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../api/tickets";
import type { Ticket } from "../types";
import { PriorityBadge, CategoryTag } from "../components/Badges";

export const NewTicketPage = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Ticket | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const ticket = await createTicket(subject, description);
      setResult(ticket);
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't submit your ticket. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // After submission, show what the AI decided — this is the moment
  // that actually demonstrates the AI feature working end to end.
  if (result) {
    return (
      <div style={{ maxWidth: "560px", margin: "48px auto", padding: "0 20px" }}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
            padding: "28px",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Ticket submitted
            </span>
          </div>
          <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>{result.subject}</h2>

          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <PriorityBadge priority={result.priority} />
            <CategoryTag category={result.category} />
          </div>

          <div
            style={{
              background: "var(--accent-soft)",
              borderRadius: "var(--radius-sm)",
              padding: "14px 16px",
              marginBottom: "10px",
            }}
          >
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)", marginBottom: "6px" }}>
              How this was triaged
            </p>
            <p style={{ fontSize: "13px", color: "var(--ink-soft)", lineHeight: 1.5 }}>
              {result.aiReasoning}
            </p>
          </div>

          <p style={{ fontSize: "13px", color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: "20px" }}>
            A support agent will follow up shortly. You can track replies on your tickets page.
          </p>

          <button onClick={() => navigate("/")} style={buttonStyle}>
            View my tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "560px", margin: "48px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "6px" }}>New support ticket</h1>
      <p style={{ fontSize: "13px", color: "var(--ink-soft)", marginBottom: "24px" }}>
        Describe what's going on. We'll sort and prioritize it automatically.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius)",
          padding: "24px",
          boxShadow: "var(--shadow)",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500 }}>Subject</span>
          <input
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Can't reset my password"
            style={inputStyle}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500 }}>Description</span>
          <textarea
            required
            minLength={10}
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="The more detail you give, the better we can help. What happened, when, and what you expected instead?"
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
          />
        </label>

        {error && <p style={{ fontSize: "13px", color: "var(--urgent)", margin: 0 }}>{error}</p>}

        <button type="submit" disabled={submitting} style={buttonStyle}>
          {submitting ? "Analyzing and submitting…" : "Submit ticket"}
        </button>
      </form>
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
  padding: "11px",
  borderRadius: "var(--radius-sm)",
  border: "none",
  background: "var(--accent)",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 600,
};
