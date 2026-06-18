import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTicketById, replyToTicket, updateTicketStatus } from "../api/tickets";
import type { Ticket, TicketStatus } from "../types";
import { PriorityBadge, StatusBadge, CategoryTag } from "../components/Badges";
import { useAuth } from "../context/AuthContext";

export const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const isAgent = user?.role === "agent" || user?.role === "admin";

  const loadTicket = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getTicketById(id);
      setTicket(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReply = async () => {
    if (!id || !replyText.trim()) return;
    setSending(true);
    try {
      const updated = await replyToTicket(id, replyText);
      setTicket(updated);
      setReplyText("");
    } finally {
      setSending(false);
    }
  };

  const useAISuggestion = () => {
    if (ticket?.aiSuggestedReply) {
      setReplyText(ticket.aiSuggestedReply);
    }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!id) return;
    const updated = await updateTicketStatus(id, status);
    setTicket(updated);
  };

  if (loading) {
    return <p style={{ padding: "40px", fontSize: "13px", color: "var(--ink-soft)" }}>Loading…</p>;
  }

  if (!ticket) {
    return <p style={{ padding: "40px", fontSize: "13px", color: "var(--ink-soft)" }}>Ticket not found.</p>;
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "20px" }}>{ticket.subject}</h1>
        {isAgent && (
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
            style={{
              padding: "6px 10px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--line)",
              fontSize: "13px",
              background: "var(--surface)",
              flexShrink: 0,
            }}
          >
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <PriorityBadge priority={ticket.priority} />
        <StatusBadge status={ticket.status} />
        <CategoryTag category={ticket.category} />
      </div>

      {isAgent && ticket.aiReasoning && (
        <div
          style={{
            background: "var(--accent-soft)",
            borderRadius: "var(--radius-sm)",
            padding: "14px 16px",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)", marginBottom: "6px" }}>
            AI triage reasoning
          </p>
          <p style={{ fontSize: "13px", color: "var(--ink-soft)", lineHeight: 1.5 }}>{ticket.aiReasoning}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
        {ticket.messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.senderRole === "customer" ? "flex-start" : "flex-end",
              maxWidth: "80%",
              background: msg.senderRole === "customer" ? "var(--surface)" : "var(--accent)",
              color: msg.senderRole === "customer" ? "var(--ink)" : "#fff",
              border: msg.senderRole === "customer" ? "1px solid var(--line)" : "none",
              borderRadius: "var(--radius-sm)",
              padding: "10px 14px",
            }}
          >
            <p style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px", textTransform: "capitalize" }}>
              {msg.senderRole}
            </p>
            <p style={{ fontSize: "13px", lineHeight: 1.5 }}>{msg.text}</p>
          </div>
        ))}
      </div>

      {isAgent && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
            padding: "16px",
          }}
        >
          {ticket.aiSuggestedReply && (
            <button
              onClick={useAISuggestion}
              style={{
                fontSize: "12px",
                color: "var(--accent)",
                background: "var(--accent-soft)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "6px 12px",
                marginBottom: "10px",
                fontWeight: 500,
              }}
            >
              Use AI-suggested reply
            </button>
          )}
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={4}
            placeholder="Write a reply…"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--line)",
              background: "var(--paper)",
              fontFamily: "inherit",
              fontSize: "13px",
              resize: "vertical",
              marginBottom: "10px",
            }}
          />
          <button
            onClick={handleReply}
            disabled={sending || !replyText.trim()}
            style={{
              padding: "9px 16px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {sending ? "Sending…" : "Send reply"}
          </button>
        </div>
      )}
    </div>
  );
};
