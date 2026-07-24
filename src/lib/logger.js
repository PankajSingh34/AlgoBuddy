/**
 * logger.js
 *
 * Centralized structured logging utility for AlgoBuddy server-side modules.
 * Built on top of pino for high-performance JSON-structured log output.
 *
 * Usage (ESM):
 *   import logger from "@/lib/logger";
 *   import { createLogger } from "@/lib/logger";
 *   const log = createLogger("my-module");
 *   log.info("Server started");
 *   log.warn({ userId }, "Rate limit approaching");
 *   log.error({ err }, "Unhandled exception");
 *
 * Usage (CJS):
 *   const { createLogger } = require("../logger");
 *   const log = createLogger("sandbox");
 *
 * Log Levels (lowest → highest severity):
 *   trace  → very verbose debugging
 *   debug  → debugging details (disabled in production by default)
 *   info   → general operational events
 *   warn   → unexpected but recoverable situations
 *   error  → failures requiring attention
 *   fatal  → unrecoverable crashes
 *
 * The active log level is controlled by the LOG_LEVEL environment variable.
 * Defaults to "debug" in development and "info" in production.
 *
 * In production, logs are emitted as newline-delimited JSON (NDJSON).
 * In development, pino-pretty formatting is applied when available,
 * otherwise falling back to clean readable text output.
 */

import pino from "pino";

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/** Active log level — override via LOG_LEVEL env var */
const LOG_LEVEL = process.env.LOG_LEVEL ?? (IS_PRODUCTION ? "info" : "debug");

// ─────────────────────────────────────────────────────────────
// Base pino instance
// ─────────────────────────────────────────────────────────────

// Detect whether pino-pretty is available (it's a devDependency only).
// Gracefully fall back to plain JSON output if it is absent (e.g. CI with
// NODE_ENV unset, or production deployments that prune devDependencies).
let prettyTransport;
if (!IS_PRODUCTION) {
  try {
    require.resolve("pino-pretty");
    prettyTransport = {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:HH:MM:ss",
        ignore: "pid,hostname,env",
        messageFormat: "[{module}] {msg}",
      },
    };
  } catch {
    // pino-pretty not installed — use default JSON output
  }
}

const baseLogger = pino({
  level: LOG_LEVEL,

  // Structured base fields present on every log line
  base: {
    env: process.env.NODE_ENV ?? "development",
  },

  // Use ISO timestamps for readability in monitoring tools
  timestamp: pino.stdTimeFunctions.isoTime,

  // Serialize Error objects properly: include message, name, and stack
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },

  // Use pino-pretty in development when available; raw NDJSON otherwise.
  transport: prettyTransport,
});

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Create a child logger scoped to a specific module or subsystem.
 * The module name is added as a permanent "module" field on every log line
 * emitted by this child, making it easy to filter in production.
 *
 * @param {string} moduleName - e.g. "sandbox", "rateLimit", "auth"
 * @returns {import("pino").Logger}
 */
export function createLogger(moduleName) {
  return baseLogger.child({ module: moduleName });
}

/**
 * Default root logger — use this when you don't need per-module scoping.
 * Prefer createLogger() for new modules to keep logs filterable.
 */
export default baseLogger;
