import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../api/tickets";
import type { Ticket, TicketStatus, TicketPriority } from "../types";
import { PriorityBadge, StatusBadge, CategoryTag } from "../components/Badges";
import { useAuth } from "../context/AuthContext";

export const TicketsListPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all");

  const isAgent = user?.role === "agent" || user?.role === "admin";

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets({
        status: statusFilter === "all" ? undefined : statusFilter,
        priority: priorityFilter === "all" ? undefined : priorityFilter,
      });
      setTickets(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, priorityFilter]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", marginBottom: "4px" }}>
            {isAgent ? "All tickets" : "My tickets"}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--ink-soft)" }}>
            {isAgent
              ? "Sorted by AI-assigned priority — urgent issues surface first."
              : "Track replies on the tickets you've submitted."}
          </p>
        </div>
        {!isAgent && (
          <Link
            to="/new"
            style={{
              background: "var(--accent)",
              color: "#fff",
              padding: "9px 16px",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            + New ticket
          </Link>
        )}
      </div>

      {isAgent && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} style={selectStyle}>
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)} style={selectStyle}>
            <option value="all">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      )}

      {loading ? (
        <p style={{ fontSize: "13px", color: "var(--ink-soft)" }}>Loading tickets…</p>
      ) : tickets.length === 0 ? (
        <div
          style={{
            background: "var(--surface)",
            border: "1px dashed var(--line)",
            borderRadius: "var(--radius)",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "14px", color: "var(--ink-soft)" }}>
            {isAgent ? "No tickets match these filters yet." : "You haven't submitted any tickets yet."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {tickets.map((ticket) => (
            <Link
              key={ticket._id}
              to={`/tickets/${ticket._id}`}
              style={{
                display: "block",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{ticket.subject}</p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--ink-soft)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ticket.description}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <CategoryTag category={ticket.category} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const selectStyle: React.CSSProperties = {
  padding: "7px 10px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--line)",
  background: "var(--surface)",
  fontSize: "13px",
  color: "var(--ink)",
};
