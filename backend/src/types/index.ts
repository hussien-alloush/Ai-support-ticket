import { Request } from "express";

export type UserRole = "customer" | "agent" | "admin";

export type TicketCategory =
  | "billing"
  | "technical"
  | "account"
  | "feature_request"
  | "other";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface AITicketAnalysis {
  category: TicketCategory;
  priority: TicketPriority;
  suggestedReply: string;
  reasoning: string;
}

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

// Extends Express's Request so middleware can attach the authenticated user
export interface AuthRequest extends Request {
  user?: AuthPayload;
}
