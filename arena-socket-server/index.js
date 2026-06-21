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

function isAllowedVercelOrigin(origin) {
  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();
    return hostname === 'algobuddy.vercel.app' ||
      hostname.endsWith('.algobuddy.vercel.app');
  } catch {
    return false;
  }
}

function isOriginAllowed(origin, callback) {
  // Allow requests with no origin (Render health checks, server-to-server)
  if (!origin) return callback(null, true);
  if (ALLOWED_ORIGINS.includes(origin) || isAllowedVercelOrigin(origin)) {
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

// Lua scripts for atomic matchmaking operations
const ATOMIC_JOIN_MATCHMAKING_SCRIPT = `
  local queueKey = KEYS[1]
  local socketKey = KEYS[2]
  local matchKey = KEYS[3]
  local entry = ARGV[1]
  local userId = ARGV[2]
  local socketId = ARGV[3]
  local matchDetails = ARGV[4]
  local maxAttempts = tonumber(ARGV[5]) or 5

  local existingQueueKey = redis.call('HGET', socketKey, 'queueKey')
  if existingQueueKey then
    local elements = redis.call('LRANGE', existingQueueKey, 0, -1)
    if elements and #elements > 0 then
      for i = 1, #elements do
        local el = elements[i]
        local p_socketId = string.match(el, '"socketId"%s*:%s*"([^"]+)"')
        local p_userId = string.match(el, '"userId"%s*:%s*"([^"]+)"')
        if p_socketId == socketId or p_userId == userId then
          redis.call('LREM', existingQueueKey, 0, el)
        end
      end
    end
  end

  -- Bounded self-match retry: pop, skip self, retry up to maxAttempts times
  local skipList = {}
  for attempt = 1, maxAttempts do
    local opponentStr = redis.call('LPOP', queueKey)
    if not opponentStr then
      break
    end

    local oppUserId = string.match(opponentStr, '"userId"%s*:%s*"([^"]+)"')
    local oppSocketId = string.match(opponentStr, '"socketId"%s*:%s*"([^"]+)"')
    local oppName = string.match(opponentStr, '"name"%s*:%s*"([^"]+)"') or 'Player'
    local oppRating = string.match(opponentStr, '"rating"%s*:%s*(%d+)') or '1200'
    local oppLevel = string.match(opponentStr, '"level"%s*:%s*(%d+)') or '1'

    if oppUserId == userId then
      table.insert(skipList, opponentStr)
    else
      local created = redis.call('SET', matchKey, matchDetails, 'NX', 'EX', 3600)
      if created then
        local oppKey = 'socket:' .. oppSocketId
        redis.call('HSET', socketKey, 'matchId', matchKey)
        redis.call('HSET', oppKey, 'matchId', matchKey)
        redis.call('HDEL', socketKey, 'queueKey')
        redis.call('HDEL', oppKey, 'queueKey')
        -- Re-queue skipped self-match entries preserving queue order
        for i = #skipList, 1, -1 do
          redis.call('RPUSH', queueKey, skipList[i])
        end
        return '{"status":"MATCH_FOUND","opponent":{"userId":"' .. oppUserId .. '","socketId":"' .. oppSocketId .. '","name":"' .. oppName .. '","rating":' .. oppRating .. ',"level":' .. oppLevel .. '}}'
      else
        redis.call('RPUSH', queueKey, opponentStr)
      end
    end
  end

  -- Re-queue remaining skipList entries
  for i = #skipList, 1, -1 do
    redis.call('RPUSH', queueKey, skipList[i])
  end

  -- Remove stale entries for this user/socket from queue before adding
  local elements = redis.call('LRANGE', queueKey, 0, -1)
  if elements and #elements > 0 then
    for i = 1, #elements do
      local el = elements[i]
      local p_socketId = string.match(el, '"socketId"%s*:%s*"([^"]+)"')
      local p_userId = string.match(el, '"userId"%s*:%s*"([^"]+)"')
      if p_socketId == socketId or p_userId == userId then
        redis.call('LREM', queueKey, 0, el)
      end
    end
  end
  redis.call('RPUSH', queueKey, entry)
  redis.call('HSET', socketKey, 'queueKey', queueKey)
  return '{"status":"QUEUED"}'
`;

const ATOMIC_LEAVE_MATCHMAKING_SCRIPT = `
  local socketKey = KEYS[1]
  local userId = ARGV[1]
  local socketId = ARGV[2]

  local existingQueueKey = redis.call('HGET', socketKey, 'queueKey')
  if existingQueueKey then
    local elements = redis.call('LRANGE', existingQueueKey, 0, -1)
    if elements and #elements > 0 then
      for i = 1, #elements do
        local el = elements[i]
        local p_socketId = string.match(el, '"socketId"%s*:%s*"([^"]+)"')
        local p_userId = string.match(el, '"userId"%s*:%s*"([^"]+)"')
        if p_socketId == socketId or p_userId == userId then
          redis.call('LREM', existingQueueKey, 0, el)
        end
      end
    end
    redis.call('HDEL', socketKey, 'queueKey')
  end
  return 1
`;

const ATOMIC_DISCONNECT_CLEANUP_SCRIPT = `
  local socketKey = KEYS[1]
  local userId = ARGV[1]
  local socketId = ARGV[2]

  local existingQueueKey = redis.call('HGET', socketKey, 'queueKey')
  if existingQueueKey then
    local elements = redis.call('LRANGE', existingQueueKey, 0, -1)
    if elements and #elements > 0 then
      for i = 1, #elements do
        local el = elements[i]
        local p_socketId = string.match(el, '"socketId"%s*:%s*"([^"]+)"')
        local p_userId = string.match(el, '"userId"%s*:%s*"([^"]+)"')
        if p_socketId == socketId or p_userId == userId then
          redis.call('LREM', existingQueueKey, 0, el)
        end
      end
    end
  end

  local matchId = redis.call('HGET', socketKey, 'matchId')
  local opponentSocketId = ''

  if matchId then
    local matchStr = redis.call('GET', 'match:' .. matchId)
    if matchStr then
      -- String replacement of status: "in-progress" to "completed"
      local updatedMatchStr = string.gsub(matchStr, '"status"%s*:%s*"in%-progress"', '"status":"completed"')
      redis.call('SET', 'match:' .. matchId, updatedMatchStr, 'EX', 3600)
      
      -- Extract socketIds using pattern matching
      for sId in string.gmatch(matchStr, '"socketId"%s*:%s*"([^"]+)"') do
        if sId ~= socketId then
          opponentSocketId = sId
        end
        redis.call('HDEL', 'socket:' .. sId, 'matchId')
      end
    end
  end

  redis.call('DEL', socketKey)
  redis.call('DEL', 'ratelimit:' .. socketId)

  return '{"opponentSocketId":"' .. opponentSocketId .. '"}'
`;

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

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
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
    jwt.verify(token, getKey, { algorithms: ["ES256", "RS256"] }, function (err, decoded) {
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
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          await redisClient.lrem(key, 0, el);
          changed = true;
          continue;
        }
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
      const matchId = `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const matchKey = `match:${matchId}`;

      const queueEntry = JSON.stringify({
        ...data,
        userId: socket.data.userId,
        topic: targetTopic,
        difficulty: targetDifficulty,
        socketId: socket.id,
      });

      const matchDetails = JSON.stringify({
        matchId,
        topic: targetTopic,
        difficulty: targetDifficulty,
        status: "in-progress",
        players: [],
      });

      const resultStr = await redisClient.eval(
        ATOMIC_JOIN_MATCHMAKING_SCRIPT,
        3,
        queueKey,
        `socket:${socket.id}`,
        matchKey,
        queueEntry,
        socket.data.userId,
        socket.id,
        matchDetails,
        5,
      );

      const result = JSON.parse(resultStr);

      if (result.status === 'MATCH_FOUND') {
        const opponent = result.opponent;

        // JS-side socket liveness check: verify opponent socket is still connected
        // before finalizing the match. Lua cannot observe Socket.IO connection state.
        const opponentSocket = io.sockets.sockets.get(opponent.socketId);
        if (!opponentSocket || !opponentSocket.connected) {
          await redisClient.del(matchKey);
          const queueEntry = JSON.stringify({
            ...data,
            userId: socket.data.userId,
            topic: targetTopic,
            difficulty: targetDifficulty,
            socketId: socket.id,
          });
          await redisClient.rpush(queueKey, queueEntry);
          await redisClient.hset(`socket:${socket.id}`, "queueKey", queueKey);
          console.log(`Opponent socket disconnected, re-queued user: ${socket.data.userId}`);
          return;
        }

        const fullMatchDetails = {
          matchId,
          topic: targetTopic,
          difficulty: targetDifficulty,
          status: "in-progress",
          players: [
            { userId: opponent.userId, name: opponent.name, socketId: opponent.socketId },
            { userId: socket.data.userId, name: data.name || "Player", socketId: socket.id },
          ],
        };

        await redisClient.set(matchKey, JSON.stringify(fullMatchDetails));

        io.to(opponent.socketId).emit("match_found", fullMatchDetails);
        io.to(socket.id).emit("match_found", fullMatchDetails);

        socket.join(matchId);
        io.in(opponent.socketId).socketsJoin(matchId);

        console.log(`Match found: ${opponent.userId} vs ${socket.data.userId}`);
      } else {
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
      await redisClient.eval(
        ATOMIC_LEAVE_MATCHMAKING_SCRIPT,
        1,
        `socket:${socket.id}`,
        socket.data.userId,
        socket.id,
      );
    } catch (error) {
      console.error(`[leave_matchmaking] Error for user ${socket.data.userId}:`, error);
      socket.emit("error", { message: "Error leaving matchmaking. Please try again." });
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

      const ATOMIC_COMPLETE_SCRIPT = `
        local matchKey = KEYS[1]
        local matchStr = redis.call('GET', matchKey)
        if not matchStr then return 0 end
        
        -- Check if already completed
        if string.find(matchStr, '"status"%s*:%s*"completed"') then
          return 0
        end
        
        -- Replace status and add/replace winnerId
        local updated = string.gsub(matchStr, '"status"%s*:%s*"[^"]+"', '"status":"completed"')
        if string.find(updated, '"winnerId"') then
          updated = string.gsub(updated, '"winnerId"%s*:%s*"[^"]+"', '"winnerId":"' .. ARGV[1] .. '"')
        else
          updated = string.gsub(updated, '}%s*$', ',"winnerId":"' .. ARGV[1] .. '"}')
        end
        
        redis.call('SET', matchKey, updated)
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
      const resultStr = await redisClient.eval(
        ATOMIC_DISCONNECT_CLEANUP_SCRIPT,
        1,
        `socket:${socket.id}`,
        socket.data.userId,
        socket.id,
      );

      const result = JSON.parse(resultStr);

      if (result.opponentSocketId) {
        io.to(result.opponentSocketId).emit("opponent_disconnected", { winnerId: socket.data.userId });
      }

      console.log(`User disconnected: ${socket.id}`);
    } catch (error) {
      console.error(`[disconnect] Error for user ${socket.id}:`, error);
    }
  });
});

app.get("/debug", async (req, res) => {
  try {
    const keys = await redisClient.keys('*');
    const dbContent = {};
    for (const key of keys) {
      const type = await redisClient.type(key);
      if (type === 'string') {
        dbContent[key] = await redisClient.get(key);
      } else if (type === 'list') {
        dbContent[key] = await redisClient.lrange(key, 0, -1);
      } else if (type === 'hash') {
        dbContent[key] = await redisClient.hgetall(key);
      } else {
        dbContent[key] = `[type: ${type}]`;
      }
    }
    const activeSockets = [];
    for (const [id, s] of io.sockets.sockets.entries()) {
      activeSockets.push({
        socketId: id,
        userId: s.data?.userId,
        connected: s.connected
      });
    }
    res.json({
      status: "Redis debug info",
      activeConnections: io.engine.clientsCount,
      activeSockets: activeSockets,
      redisKeys: keys,
      redisContent: dbContent
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "Arena Socket Server is running with Redis!" });
});

server.listen(PORT, () => {
  console.log(`Arena Socket Server running on port ${PORT}`);
});
