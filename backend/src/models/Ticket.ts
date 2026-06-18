import mongoose, { Document, Schema, Types } from "mongoose";
import { TicketCategory, TicketPriority, TicketStatus } from "../types";

export interface IMessage {
  sender: Types.ObjectId;
  senderRole: "customer" | "agent" | "ai";
  text: string;
  createdAt: Date;
}

export interface ITicket extends Document {
  subject: string;
  description: string;
  customer: Types.ObjectId;
  assignedAgent?: Types.ObjectId;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  aiSuggestedReply?: string;
  aiReasoning?: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: {
      type: String,
      enum: ["customer", "agent", "ai"],
      required: true,
    },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ticketSchema = new Schema<ITicket>(
  {
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedAgent: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      enum: ["billing", "technical", "account", "feature_request", "other"],
      default: "other",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    aiSuggestedReply: {
      type: String,
    },
    aiReasoning: {
      type: String,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Helpful for the agent dashboard: filter/sort by status + priority quickly
ticketSchema.index({ status: 1, priority: -1 });

export const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);
