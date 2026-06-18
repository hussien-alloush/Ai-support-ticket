import { api } from "./client";
import type { Ticket, TicketStatus, TicketPriority } from "../types";

export const createTicket = async (
  subject: string,
  description: string
): Promise<Ticket> => {
  const { data } = await api.post<{ success: boolean; ticket: Ticket }>(
    "/tickets",
    { subject, description }
  );
  return data.ticket;
};

export const getTickets = async (filters?: {
  status?: TicketStatus;
  priority?: TicketPriority;
}): Promise<Ticket[]> => {
  const { data } = await api.get<{ success: boolean; tickets: Ticket[] }>(
    "/tickets",
    { params: filters }
  );
  return data.tickets;
};

export const getTicketById = async (id: string): Promise<Ticket> => {
  const { data } = await api.get<{ success: boolean; ticket: Ticket }>(
    `/tickets/${id}`
  );
  return data.ticket;
};

export const replyToTicket = async (
  id: string,
  text: string
): Promise<Ticket> => {
  const { data } = await api.post<{ success: boolean; ticket: Ticket }>(
    `/tickets/${id}/reply`,
    { text }
  );
  return data.ticket;
};

export const updateTicketStatus = async (
  id: string,
  status: TicketStatus
): Promise<Ticket> => {
  const { data } = await api.patch<{ success: boolean; ticket: Ticket }>(
    `/tickets/${id}/status`,
    { status }
  );
  return data.ticket;
};
