export type UserRole = "customer" | "agent" | "admin";

export type TicketCategory =
  | "billing"
  | "technical"
  | "account"
  | "feature_request"
  | "other";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface TicketMessage {
  sender: string;
  senderRole: "customer" | "agent" | "ai";
  text: string;
  createdAt: string;
}

export interface Ticket {
  _id: string;
  subject: string;
  description: string;
  customer: { _id: string; name: string; email: string } | string;
  assignedAgent?: { _id: string; name: string; email: string } | string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  aiSuggestedReply?: string;
  aiReasoning?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}
