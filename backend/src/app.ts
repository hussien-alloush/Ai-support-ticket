import express, { Application } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import { notFound, errorHandler } from "./middleware/errorHandler";

export const createApp = (): Application => {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
  app.use(express.json());

  // Basic rate limiting on ticket creation to protect the OpenAI usage/cost
  const ticketCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 ticket submissions per hour per IP
    message: { success: false, message: "Too many tickets created. Please try again later." },
  });

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/tickets", ticketCreationLimiter, ticketRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
