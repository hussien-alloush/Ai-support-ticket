import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { createApp } from "./app";
import { connectDB } from "./config/db";
import { initSocket } from "./sockets/socketManager";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();

  const app = createApp();
  const httpServer = http.createServer(app);

  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
