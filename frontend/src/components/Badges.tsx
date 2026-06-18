import type { TicketPriority, TicketStatus, TicketCategory } from "../types";

const priorityConfig: Record<TicketPriority, { label: string; color: string; bg: string }> = {
  urgent: { label: "Urgent", color: "var(--urgent)", bg: "var(--urgent-bg)" },
  high: { label: "High", color: "var(--high)", bg: "var(--high-bg)" },
  medium: { label: "Medium", color: "var(--medium)", bg: "var(--medium-bg)" },
  low: { label: "Low", color: "var(--low)", bg: "var(--low-bg)" },
};

export const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const config = priorityConfig[priority];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
        color: config.color,
        background: config.bg,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: config.color,
        }}
      />
      {config.label}
    </span>
  );
};

const statusConfig: Record<TicketStatus, { label: string; color: string }> = {
  open: { label: "Open", color: "var(--status-open)" },
  in_progress: { label: "In progress", color: "var(--status-progress)" },
  resolved: { label: "Resolved", color: "var(--status-resolved)" },
  closed: { label: "Closed", color: "var(--status-closed)" },
};

export const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const config = statusConfig[status];
  return (
    <span
      style={{
        fontSize: "12px",
        fontWeight: 500,
        color: config.color,
        border: `1px solid ${config.color}`,
        padding: "2px 9px",
        borderRadius: "20px",
        whiteSpace: "nowrap",
      }}
    >
      {config.label}
    </span>
  );
};

const categoryLabels: Record<TicketCategory, string> = {
  billing: "Billing",
  technical: "Technical",
  account: "Account",
  feature_request: "Feature request",
  other: "Other",
};

export const CategoryTag = ({ category }: { category: TicketCategory }) => (
  <span
    style={{
      fontSize: "12px",
      color: "var(--ink-soft)",
      background: "var(--surface)",
      border: "1px solid var(--line)",
      padding: "2px 9px",
      borderRadius: "6px",
      whiteSpace: "nowrap",
    }}
  >
    {categoryLabels[category]}
  </span>
);
