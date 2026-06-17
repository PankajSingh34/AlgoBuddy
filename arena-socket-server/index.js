require("dotenv").config({ path: '../.env.local' });
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwksClient = require('jwks-rsa');
const redisUrl = process.env.REDIS_URL;
const Redis = redisUrl ? require("ioredis") : require("ioredis-mock");
const { createAdapter } = require("@socket.io/redis-adapter");

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(new Error("Not allowed by CORS"));
    }
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
}));

const server = http.createServer(app);

// Redis setup
const pubClient = redisUrl ? new Redis(redisUrl) : new Redis();
const subClient = pubClient.duplicate();
const redisClient = pubClient.duplicate();

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(new Error("Not allowed by CORS"));
      }
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
  adapter: createAdapter(pubClient, subClient)
});

const PORT = process.env.PORT || 4000;

// JWT Authentication
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

const client = jwksClient({
  jwksUri: `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      callback(err, null);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyAuthToken(token) {
  return new Promise((resolve) => {
    if (!token || !SUPABASE_URL) {
      resolve(null);
      return;
    }
    jwt.verify(token, getKey, { algorithms: ["ES256", "RS256"] }, function(err, decoded) {
      if (err) {
        resolve(null);
      } else {
        resolve(decoded);
      }
    });
  });
}

// Connection rate limiting to prevent JWT brute-forcing
const connectionAttempts = new Map();
const MAX_CONNECTION_ATTEMPTS = 5;
const CONNECTION_ATTEMPT_WINDOW_MS = 60000;

function isConnectionRateLimited(ip) {
  const now = Date.now();
  const entry = connectionAttempts.get(ip);
  if (!entry || now > entry.resetTime) {
    connectionAttempts.set(ip, { count: 1, resetTime: now + CONNECTION_ATTEMPT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_CONNECTION_ATTEMPTS;
}

// Cleanup interval to prevent memory leaks in connection rate limiter
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of connectionAttempts.entries()) {
    if (now > entry.resetTime) {
      connectionAttempts.delete(ip);
    }
  }
}, CONNECTION_ATTEMPT_WINDOW_MS);

// Rate Limiting Config (Redis-backed token bucket)
const MAX_TOKENS = 10;
const REFILL_RATE_MS = 200;

async function isRateLimited(userId) {
  const key = `ratelimit:${userId}`;
  const now = Date.now();
  
  const script = `
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local max_tokens = tonumber(ARGV[2])
    local refill_rate = tonumber(ARGV[3])
    
    local data = redis.call('HMGET', key, 'tokens', 'lastRequestTime')
    local tokens = tonumber(data[1])
    local lastRequestTime = tonumber(data[2])
    
    if not tokens then
      redis.call('HMSET', key, 'tokens', max_tokens - 1, 'lastRequestTime', now)
      redis.call('EXPIRE', key, 60)
      return 0
    end
    
    local timePassed = now - lastRequestTime
    local tokensToAdd = math.floor(timePassed / refill_rate)
    
    if tokensToAdd > 0 then
      tokens = math.min(max_tokens, tokens + tokensToAdd)
      lastRequestTime = now
    end
    
    if tokens > 0 then
      redis.call('HMSET', key, 'tokens', tokens - 1, 'lastRequestTime', lastRequestTime)
      redis.call('EXPIRE', key, 60)
      return 0
    end
    return 1
  `;
  
  const result = await redisClient.eval(script, 1, key, now, MAX_TOKENS, REFILL_RATE_MS);
  return result === 1;
}

io.on("connection", async (socket) => {
  // Connection-level rate limiting to prevent JWT brute-forcing
  const clientIp = socket.handshake.address;
  if (isConnectionRateLimited(clientIp)) {
    socket.emit("error", { message: "Too many connection attempts. Please try again later." });
    socket.disconnect(true);
    return;
  }

  // Verify Supabase JWT from handshake auth using JWKS
  const token = socket.handshake.auth?.token;
  const authPayload = await verifyAuthToken(token);
  if (!authPayload) {
    socket.emit("error", { message: "Authentication required. Please sign in again." });
    socket.disconnect(true);
    return;
  }

  // Store verified userId from the JWT payload — never trust client-supplied userId
  socket.data.userId = authPayload.sub || authPayload.id;
  console.log(`Authenticated user connected: ${socket.id}, userId: ${socket.data.userId}`);

  socket.on("join_matchmaking", async (data) => {
    try {
      if (await isRateLimited(socket.data.userId)) return;
    
    console.log(`User joined matchmaking: userId=${socket.data.userId}`);
    const targetTopic = data.topic || "Arrays";
    const targetDifficulty = data.difficulty || "Easy";
    const queueKey = `queue:${targetTopic}:${targetDifficulty}`;

    // Remove any existing entry for this user across all possible queues to prevent duplicates
    const existingQueueKey = await redisClient.hget(`socket:${socket.id}`, "queueKey");
    if (existingQueueKey) {
      const elements = await redisClient.lrange(existingQueueKey, 0, -1);
      for (const el of elements) {
        const parsed = JSON.parse(el);
        if (parsed.socketId === socket.id || parsed.userId === socket.data.userId) {
          await redisClient.lrem(existingQueueKey, 0, el);
        }
      }
    }

    // Try to find an opponent
      let matchFound = false;
      const skippedOpponents = [];
      
      while (!matchFound) {
        const opponentStr = await redisClient.lpop(queueKey);
        if (!opponentStr) {
          break;
        }
        
        const opponent = JSON.parse(opponentStr);
        if (opponent.userId === socket.data.userId) {
          skippedOpponents.push(opponentStr);
          continue; 
        }
        
        matchFound = true;
      const matchId = `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const matchDetails = {
        matchId,
        topic: targetTopic,
        difficulty: targetDifficulty,
        status: "in-progress",
        players: [
          { userId: opponent.userId, name: opponent.name, socketId: opponent.socketId },
          { userId: socket.data.userId, name: data.name || "Player", socketId: socket.id },
        ],
      };

      await redisClient.set(`match:${matchId}`, JSON.stringify(matchDetails));
      await redisClient.hset(`socket:${socket.id}`, "matchId", matchId);
      await redisClient.hset(`socket:${opponent.socketId}`, "matchId", matchId);
      await redisClient.hdel(`socket:${socket.id}`, "queueKey");
      await redisClient.hdel(`socket:${opponent.socketId}`, "queueKey");

      io.to(opponent.socketId).emit("match_found", matchDetails);
      io.to(socket.id).emit("match_found", matchDetails);

      socket.join(matchId);
      io.in(opponent.socketId).socketsJoin(matchId);
      
      console.log(`Match found: ${opponent.userId} vs ${socket.data.userId}`);
      break;
    }

      if (skippedOpponents.length > 0) {
        await redisClient.lpush(queueKey, ...skippedOpponents);
      }

      if (!matchFound) {
        const queueData = JSON.stringify({ ...data, userId: socket.data.userId, topic: targetTopic, difficulty: targetDifficulty, socketId: socket.id });
        await redisClient.rpush(queueKey, queueData);
        await redisClient.hset(`socket:${socket.id}`, "queueKey", queueKey);
        console.log(`Added to queue ${queueKey}`);
      }
    } catch (error) {
      console.error(`[join_matchmaking] Error for user ${socket.data.userId}:`, error);
      socket.emit("error", { message: "Matchmaking error. Please try again." });
    }
  });

  socket.on("leave_matchmaking", async () => {
    try {
      if (await isRateLimited(socket.data.userId)) return;
      const existingQueueKey = await redisClient.hget(`socket:${socket.id}`, "queueKey");
      if (existingQueueKey) {
        const elements = await redisClient.lrange(existingQueueKey, 0, -1);
        for (const el of elements) {
          const parsed = JSON.parse(el);
          if (parsed.socketId === socket.id) {
            await redisClient.lrem(existingQueueKey, 0, el);
          }
        }
        await redisClient.hdel(`socket:${socket.id}`, "queueKey");
      }
    } catch (error) {
      console.error(`[leave_matchmaking] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("join_match", async (data) => {
    try {
      // Verify the socket is a participant in the match before allowing room join
      const matchId = await redisClient.hget(`socket:${socket.id}`, "matchId");
      if (!matchId || matchId !== data.matchId) return;
      socket.join(data.matchId);
    } catch (error) {
      console.error(`[join_match] Error for user ${socket.data.userId}:`, error);
    }
  });

  // Duel Room Events
  socket.on("code_update", async (data) => {
    try {
      if (await isRateLimited(socket.data.userId)) return;
      const matchId = await redisClient.hget(`socket:${socket.id}`, "matchId");
      if (!matchId || matchId !== data.matchId) return;

      socket.to(data.matchId).emit("opponent_code_update", {
        code: data.code,
        userId: socket.data.userId
      });
    } catch (error) {
      console.error(`[code_update] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("test_submit", async (data) => {
    try {
      if (await isRateLimited(socket.data.userId)) return;
      const matchId = await redisClient.hget(`socket:${socket.id}`, "matchId");
      if (!matchId || matchId !== data.matchId) return;

      socket.to(data.matchId).emit("opponent_test_submit", { userId: socket.data.userId });
    } catch (error) {
      console.error(`[test_submit] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("test_result", async (data) => {
    try {
      if (await isRateLimited(socket.data.userId)) return;
      
      const matchId = await redisClient.hget(`socket:${socket.id}`, "matchId");
      if (!matchId || matchId !== data.matchId) return;

      socket.to(data.matchId).emit("opponent_test_result", {
        userId: socket.data.userId,
        passed: data.passed,
        total: data.total,
        status: data.status
      });
    } catch (error) {
      console.error(`[test_result] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("match_complete", async (data) => {
    try {
      if (await isRateLimited(socket.data.userId)) return;
      
      const matchId = await redisClient.hget(`socket:${socket.id}`, "matchId");
      if (!matchId || matchId !== data.matchId) return;
      
      const matchStr = await redisClient.get(`match:${matchId}`);
      if (matchStr) {
        const match = JSON.parse(matchStr);
        if (match.status !== "completed") {
          match.status = "completed";
          await redisClient.set(`match:${matchId}`, JSON.stringify(match));
          
          io.in(matchId).emit("match_ended", { winnerId: socket.data.userId });
          
          for (const p of match.players) {
            await redisClient.hdel(`socket:${p.socketId}`, "matchId");
          }
          await redisClient.expire(`match:${matchId}`, 60 * 60);
        }
      }
    } catch (error) {
      console.error(`[match_complete] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      // 1. Remove from matchmaking queue if present
      const existingQueueKey = await redisClient.hget(`socket:${socket.id}`, "queueKey");
      if (existingQueueKey) {
        const elements = await redisClient.lrange(existingQueueKey, 0, -1);
        for (const el of elements) {
          const parsed = JSON.parse(el);
          if (parsed.socketId === socket.id) {
            await redisClient.lrem(existingQueueKey, 0, el);
          }
        }
      }
      
      // 2. Handle active match disconnects
      const matchId = await redisClient.hget(`socket:${socket.id}`, "matchId");
      if (matchId) {
        const matchStr = await redisClient.get(`match:${matchId}`);
        if (matchStr) {
          const match = JSON.parse(matchStr);
          if (match.status !== "completed") {
            match.status = "completed";
            await redisClient.set(`match:${matchId}`, JSON.stringify(match));
            
            const opponent = match.players.find(p => p.socketId !== socket.id);
            if (opponent) {
              io.to(opponent.socketId).emit("opponent_disconnected", { winnerId: opponent.userId });
            }
            
            for (const p of match.players) {
              await redisClient.hdel(`socket:${p.socketId}`, "matchId");
            }
          }
        }
      }
      
      await redisClient.del(`socket:${socket.id}`);
      console.log(`User disconnected: ${socket.id}`);
    } catch (error) {
      console.error(`[disconnect] Error for user ${socket.id}:`, error);
    }
  });
});

app.get("/debug", async (req, res) => {
  res.json({
    status: "Redis migration complete. Queue details are stored in Redis.",
    activeConnections: io.engine.clientsCount
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "Arena Socket Server is running with Redis!" });
});

server.listen(PORT, () => {
  console.log(`Arena Socket Server running on port ${PORT}`);
});
