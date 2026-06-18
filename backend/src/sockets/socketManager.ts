import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { verifyToken } from "../utils/jwt";

let io: SocketIOServer;

interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: string;
}

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  // Same auth pattern as your existing chat app: verify the JWT on connect
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error: no token provided"));
    }

    try {
      const decoded = verifyToken(token);
      socket.userId = decoded.userId;
      socket.role = decoded.role;
      next();
    } catch (err) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.userId})`);

    // Agents join a shared "agents" room so we can broadcast new tickets
    // to every agent at once (e.g. "ticket:new" notifications)
    if (socket.role === "agent" || socket.role === "admin") {
      socket.join("agents");
    }

    // Clients join a room scoped to a specific ticket so replies/status
    // changes only go to people viewing that ticket
    socket.on("ticket:join", (ticketId: string) => {
      socket.join(`ticket:${ticketId}`);
    });

    socket.on("ticket:leave", (ticketId: string) => {
      socket.leave(`ticket:${ticketId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocket() first.");
  }
  return io;
};
