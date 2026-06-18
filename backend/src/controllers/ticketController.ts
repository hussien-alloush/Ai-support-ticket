import { Response, NextFunction } from "express";
import { Ticket } from "../models/Ticket";
import { AuthRequest } from "../types";
import { AppError } from "../middleware/errorHandler";
import { analyzeTicket } from "../services/aiService";
import { getIO } from "../sockets/socketManager";

/**
 * CREATE a ticket.
 * Flow: customer submits ticket -> AI analyzes it (category, priority,
 * suggested reply) -> ticket saved with AI fields already filled in ->
 * agents are notified in real time via Socket.io.
 */
export const createTicket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { subject, description } = req.body;
    const customerId = req.user!.userId;

    // Ask AI to triage the ticket before we ever show it to a human agent
    const aiAnalysis = await analyzeTicket(subject, description);

    const ticket = await Ticket.create({
      subject,
      description,
      customer: customerId,
      category: aiAnalysis.category,
      priority: aiAnalysis.priority,
      aiSuggestedReply: aiAnalysis.suggestedReply,
      aiReasoning: aiAnalysis.reasoning,
      messages: [
        {
          sender: customerId,
          senderRole: "customer",
          text: description,
          createdAt: new Date(),
        },
      ],
    });

    // Notify all connected agents in real time that a new ticket arrived,
    // already pre-sorted by AI-assigned priority. This is the same
    // Socket.io pattern you already used in your chat project.
    getIO().to("agents").emit("ticket:new", {
      ticketId: ticket.id,
      subject: ticket.subject,
      priority: ticket.priority,
      category: ticket.category,
    });

    res.status(201).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

/**
 * GET tickets — customers see their own, agents/admins see all
 * (with optional filtering by status/priority for the dashboard).
 */
export const getTickets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, priority } = req.query;
    const filter: Record<string, unknown> = {};

    if (req.user!.role === "customer") {
      filter.customer = req.user!.userId;
    }
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tickets = await Ticket.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .populate("customer", "name email")
      .populate("assignedAgent", "name email");

    res.status(200).json({ success: true, count: tickets.length, tickets });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("customer", "name email")
      .populate("assignedAgent", "name email");

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    // Customers can only view their own tickets
    if (
      req.user!.role === "customer" &&
      ticket.customer.toString() !== req.user!.userId
    ) {
      throw new AppError("You do not have access to this ticket", 403);
    }

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

/**
 * Agent replies to a ticket. They can either send their own message
 * or accept the AI's suggested reply as-is/edited.
 */
export const replyToTicket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { text } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    ticket.messages.push({
      sender: req.user!.userId as any,
      senderRole: "agent",
      text,
      createdAt: new Date(),
    });

    if (ticket.status === "open") {
      ticket.status = "in_progress";
    }
    if (!ticket.assignedAgent) {
      ticket.assignedAgent = req.user!.userId as any;
    }

    await ticket.save();

    // Push the reply to the customer in real time
    getIO().to(`ticket:${ticket.id}`).emit("ticket:reply", {
      ticketId: ticket.id,
      message: ticket.messages[ticket.messages.length - 1],
    });

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    getIO().to(`ticket:${ticket.id}`).emit("ticket:statusChanged", {
      ticketId: ticket.id,
      status: ticket.status,
    });

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};
