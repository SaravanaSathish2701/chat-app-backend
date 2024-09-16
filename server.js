import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io"; // Named import for socket.io
import mongoose from "mongoose";
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js"; // Ensure these paths are correct
import messageRoutes from "./routes/messageRoutes.js";
import { authenticateToken } from "./middleware/authMiddleware.js";

// Create an instance of express
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize socket.io with the server
const io = new SocketIOServer(server); // Use new SocketIOServer()

// Middleware setup
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/messages", authenticateToken, messageRoutes);

// Socket.io connection setup
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle various socket events here
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/chat-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
