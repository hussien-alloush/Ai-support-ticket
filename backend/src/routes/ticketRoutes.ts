import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  replyToTicket,
  updateTicketStatus,
} from "../controllers/ticketController";
import { protect, restrictTo } from "../middleware/auth";
import {
  createTicketValidation,
  replyValidation,
  validate,
} from "../middleware/validators";

const router = Router();

// All ticket routes require a logged-in user
router.use(protect);

router.post("/", createTicketValidation, validate, createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);

// Only agents/admins can reply or change ticket status
router.post(
  "/:id/reply",
  restrictTo("agent", "admin"),
  replyValidation,
  validate,
  replyToTicket
);
router.patch("/:id/status", restrictTo("agent", "admin"), updateTicketStatus);

export default router;
