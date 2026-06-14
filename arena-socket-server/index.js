require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://algobuddy.vercel.app",
        "https://www.algobuddy.me",
        "https://algobuddy.me"
      ];
      if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

// Simple in-memory matchmaking queue
// In production, this should be a Redis queue or similar
let matchmakingQueue = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_matchmaking", (data) => {
    console.log(`User joined matchmaking:`, data);
    
    // Check if there is someone in the queue
    if (matchmakingQueue.length > 0) {
      const opponent = matchmakingQueue.shift();
      
      // Prevent matching with oneself (if testing with multiple tabs on same account)
      // COMMENTED OUT FOR EASIER LOCAL TESTING:
      /*
      if (opponent.userId === data.userId && opponent.socketId !== socket.id) {
        matchmakingQueue.push(opponent);
        matchmakingQueue.push({ ...data, socketId: socket.id });
        return;
      }
      */

      console.log(`Match found: ${opponent.userId} vs ${data.userId}`);
      
      const matchId = `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const topic = opponent.topic || data.topic || "Arrays";
      const difficulty = opponent.difficulty || data.difficulty || "Easy";

      const matchDetails = {
        matchId,
        topic,
        difficulty,
        players: [
          { userId: opponent.userId, name: opponent.name, socketId: opponent.socketId },
          { userId: data.userId, name: data.name, socketId: socket.id },
        ],
      };

      // Notify both players
      io.to(opponent.socketId).emit("match_found", matchDetails);
      io.to(socket.id).emit("match_found", matchDetails);

      // Join room for real-time duel syncing
      socket.join(matchId);
      const opponentSocket = io.sockets.sockets.get(opponent.socketId);
      if (opponentSocket) {
        opponentSocket.join(matchId);
      }

    } else {
      // Add to queue
      matchmakingQueue.push({ ...data, socketId: socket.id });
      console.log(`Added to queue. Queue length: ${matchmakingQueue.length}`);
    }
  });

  socket.on("leave_matchmaking", () => {
    matchmakingQueue = matchmakingQueue.filter((p) => p.socketId !== socket.id);
    console.log(`User left matchmaking: ${socket.id}. Queue length: ${matchmakingQueue.length}`);
  });

  socket.on("join_match", (data) => {
    socket.join(data.matchId);
    console.log(`User ${data.userId} joined match room ${data.matchId}`);
  });

  // Duel Room Events
  socket.on("code_update", (data) => {
    // Broadcast code to opponent in the same room
    socket.to(data.matchId).emit("opponent_code_update", {
      code: data.code,
      userId: data.userId
    });
  });

  socket.on("test_submit", (data) => {
    // Broadcast test start to opponent
    socket.to(data.matchId).emit("opponent_test_submit", {
      userId: data.userId
    });
  });

  socket.on("test_result", (data) => {
    // Broadcast test results to opponent
    socket.to(data.matchId).emit("opponent_test_result", {
      userId: data.userId,
      passed: data.passed,
      total: data.total,
      status: data.status
    });
  });

  socket.on("match_complete", (data) => {
    socket.to(data.matchId).emit("match_ended", {
      winnerId: data.winnerId
    });
  });

  socket.on("disconnect", () => {
    matchmakingQueue = matchmakingQueue.filter((p) => p.socketId !== socket.id);
    console.log(`User disconnected: ${socket.id}. Queue length: ${matchmakingQueue.length}`);
  });
});

app.get("/debug", (req, res) => {
  res.json({
    queueLength: matchmakingQueue.length,
    queue: matchmakingQueue,
    activeConnections: io.engine.clientsCount
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "Arena Socket Server is running", queueLength: matchmakingQueue.length });
});

server.listen(PORT, () => {
  console.log(`Arena Socket Server running on port ${PORT}`);
});
