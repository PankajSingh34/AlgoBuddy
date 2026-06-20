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
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://algobuddy.vercel.app",
  "https://www.algobuddy.me",
  "https://algobuddy.me"
];

function isOriginAllowed(origin, callback) {
  // Allow requests with no origin (Render health checks, server-to-server)
  if (!origin) return callback(null, true);
  if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith(".vercel.app")) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
}

app.use(cors({
  origin: isOriginAllowed,
  methods: ["GET", "POST"],
}));

const server = http.createServer(app);

// Redis setup
const pubClient = redisUrl ? new Redis(redisUrl) : new Redis();
const subClient = pubClient.duplicate();
const redisClient = pubClient.duplicate();

const io = new Server(server, {
  cors: {
    origin: isOriginAllowed,
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

// Periodic queue health checker to remove stale entries from matchmaking queues
setInterval(async () => {
  try {
    const queueKeys = await redisClient.keys('queue:*');
    for (const key of queueKeys) {
      const elements = await redisClient.lrange(key, 0, -1);
      let changed = false;
      for (const el of elements) {
        const parsed = JSON.parse(el);
        // Remove expired entries
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          await redisClient.lrem(key, 0, el);
          changed = true;
          continue;
        }
        // Remove entries where socket is no longer connected
        const socket = io.sockets.sockets.get(parsed.socketId);
        if (!socket || !socket.connected) {
          await redisClient.lrem(key, 0, el);
          changed = true;
        }
      }
      if (changed && elements.length === 0) {
        await redisClient.expire(key, 60);
      }
    }
  } catch (err) {
    console.error('[queue-health] Error cleaning stale entries:', err.message);
  }
}, 30000);

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

        // Discard expired entries
        if (opponent.expiresAt && Date.now() > opponent.expiresAt) {
          continue;
        }

        if (opponent.userId === socket.data.userId) {
          skippedOpponents.push(opponentStr);
          continue; 
        }

        // Verify opponent socket is still connected
        const opponentSocket = io.sockets.sockets.get(opponent.socketId);
        if (!opponentSocket || !opponentSocket.connected) {
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
        const queueData = JSON.stringify({
          ...data,
          userId: socket.data.userId,
          topic: targetTopic,
          difficulty: targetDifficulty,
          socketId: socket.id,
          timestamp: Date.now(),
          expiresAt: Date.now() + 60000,
        });
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

      // Use atomic Lua script to check status and update in one operation
      const ATOMIC_COMPLETE_SCRIPT = `
        local matchKey = KEYS[1]
        local matchStr = redis.call('GET', matchKey)
        if not matchStr then return 0 end
        local match = cjson.decode(matchStr)
        if match.status == 'completed' then return 0 end
        match.status = 'completed'
        match.winnerId = ARGV[1]
        redis.call('SET', matchKey, cjson.encode(match))
        return 1
      `;

      try {
        const acquired = await redisClient.eval(ATOMIC_COMPLETE_SCRIPT, 1, `match:${matchId}`, socket.data.userId);
        if (acquired !== 1) return;

        io.in(matchId).emit("match_ended", { winnerId: socket.data.userId });

        const matchStr = await redisClient.get(`match:${matchId}`);
        if (matchStr) {
          const match = JSON.parse(matchStr);
          for (const p of match.players) {
            await redisClient.hdel(`socket:${p.socketId}`, "matchId");
          }
        }
        await redisClient.expire(`match:${matchId}`, 60 * 60);
      } catch (err) {
        // cjson might not be available in ioredis-mock; fallback to non-atomic path
        if (err.message && err.message.includes('cjson')) {
          const matchStr = await redisClient.get(`match:${matchId}`);
          if (matchStr) {
            const match = JSON.parse(matchStr);
            if (match.status !== "completed") {
              match.status = "completed";
              match.winnerId = socket.data.userId;
              await redisClient.set(`match:${matchId}`, JSON.stringify(match));

              io.in(matchId).emit("match_ended", { winnerId: socket.data.userId });

              for (const p of match.players) {
                await redisClient.hdel(`socket:${p.socketId}`, "matchId");
              }
              await redisClient.expire(`match:${matchId}`, 60 * 60);
            }
          }
        } else {
          throw err;
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
      
      // 2. Handle active match disconnects atomically to prevent race conditions
      const matchId = await redisClient.hget(`socket:${socket.id}`, "matchId");
      if (matchId) {
        const ATOMIC_DISCONNECT_SCRIPT = `
          local matchKey = KEYS[1]
          local disconnectingSocketId = ARGV[1]
          local matchStr = redis.call('GET', matchKey)
          if not matchStr then return nil end
          local match = cjson.decode(matchStr)
          if match.status == 'completed' then return nil end
          match.status = 'completed'
          
          local opponentUserId = nil
          local opponentSocketId = nil
          for i, p in ipairs(match.players) do
            if p.socketId ~= disconnectingSocketId then
              opponentUserId = p.userId
              opponentSocketId = p.socketId
            end
          end
          
          if opponentUserId then
            match.winnerId = opponentUserId
          end
          
          redis.call('SET', matchKey, cjson.encode(match))
          return cjson.encode({
            opponentUserId = opponentUserId,
            opponentSocketId = opponentSocketId,
            players = match.players
          })
        `;

        try {
          const resultStr = await redisClient.eval(ATOMIC_DISCONNECT_SCRIPT, 1, `match:${matchId}`, socket.id);
          if (resultStr) {
            const result = JSON.parse(resultStr);
            if (result.opponentSocketId) {
              io.to(result.opponentSocketId).emit("opponent_disconnected", { winnerId: result.opponentUserId });
            }
            for (const p of result.players) {
              await redisClient.hdel(`socket:${p.socketId}`, "matchId");
            }
          }
        } catch (err) {
          // Fallback to non-atomic path if cjson is unavailable (e.g. ioredis-mock in unit tests)
          if (err.message && err.message.includes('cjson')) {
            const matchStr = await redisClient.get(`match:${matchId}`);
            if (matchStr) {
              const match = JSON.parse(matchStr);
              if (match.status !== "completed") {
                match.status = "completed";
                const opponent = match.players.find(p => p.socketId !== socket.id);
                if (opponent) {
                  match.winnerId = opponent.userId;
                  await redisClient.set(`match:${matchId}`, JSON.stringify(match));
                  io.to(opponent.socketId).emit("opponent_disconnected", { winnerId: opponent.userId });
                }
                for (const p of match.players) {
                  await redisClient.hdel(`socket:${p.socketId}`, "matchId");
                }
              }
            }
          } else {
            throw err;
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
