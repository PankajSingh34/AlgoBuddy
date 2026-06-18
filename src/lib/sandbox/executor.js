const vm = require("vm");
const { EXECUTION_STATUS } = require("./errorCodes");
const { MAX_TIMEOUT_MS, MAX_MEMORY_MB, MAX_OUTPUT_LENGTH } = require("./sandbox.config");

const MEMORY_LIMIT_BYTES = MAX_MEMORY_MB * 1024 * 1024;

async function executeCode(code) {
  const startTime = Date.now();
  const outputLines = [];

  const memoryBefore = process.memoryUsage().heapUsed;

  try {
    const sandbox = Object.create(null);
    sandbox.console = {
      log:   (...a) => outputLines.push(a.map(String).join(" ")),
      warn:  (...a) => outputLines.push("[warn] " + a.map(String).join(" ")),
      error: (...a) => outputLines.push("[error] " + a.map(String).join(" ")),
      info:  (...a) => outputLines.push("[info] " + a.map(String).join(" ")),
    };

    const context = vm.createContext(sandbox);

    vm.runInContext(`
      Object.freeze(Object.prototype);
      Object.freeze(Array.prototype);
      Object.freeze(Function.prototype);
    `, context);

    const script = new vm.Script(code, { filename: "user-code.js" });

    script.runInContext(context, { timeout: MAX_TIMEOUT_MS });

    const rawOutput = outputLines.join("\n");
    const output = rawOutput.length > MAX_OUTPUT_LENGTH
      ? rawOutput.slice(0, MAX_OUTPUT_LENGTH) + "\n… (output truncated)"
      : rawOutput;

    const memoryUsed = process.memoryUsage().heapUsed - memoryBefore;

    if (memoryUsed > MEMORY_LIMIT_BYTES) {
      return {
        status: EXECUTION_STATUS.MLE,
        output: output,
        error: `Your code used ${Math.round(memoryUsed / 1024 / 1024)} MB of memory, exceeding the ${MAX_MEMORY_MB} MB limit.`,
        executionTime: Date.now() - startTime,
        memoryUsed,
      };
    }

    return {
      status: EXECUTION_STATUS.SUCCESS,
      output,
      executionTime: Date.now() - startTime,
      memoryUsed,
    };

  } catch (err) {
    const elapsed = Date.now() - startTime;

    if (err.code === "ERR_SCRIPT_EXECUTION_TIMEOUT" || err.message?.includes("timed out")) {
      return {
        status: EXECUTION_STATUS.TLE,
        output: "",
        error: `Your code exceeded the ${MAX_TIMEOUT_MS}ms time limit.`,
        executionTime: elapsed,
        memoryUsed: 0,
      };
    }

    const memoryErr = (err.message && (
      err.message.includes("memory") ||
      err.message.includes("allocation") ||
      err.message.includes("heap")
    )) || err.code === "ERR_MEMORY_ALLOCATION_FAILED";

    if (memoryErr) {
      return {
        status: EXECUTION_STATUS.MLE,
        output: outputLines.join("\n"),
        error: `Your code used too much memory (exceeded ${MAX_MEMORY_MB} MB).`,
        executionTime: elapsed,
        memoryUsed: process.memoryUsage().heapUsed - memoryBefore,
      };
    }

    let errorMessage = err.message ?? String(err);
    if (err.name && err.name !== "Error" && !errorMessage.startsWith(err.name)) {
      errorMessage = `${err.name}: ${errorMessage}`;
    }
    return {
      status: EXECUTION_STATUS.RUNTIME_ERROR,
      output: outputLines.join("\n"),
      error: errorMessage,
      executionTime: elapsed,
      memoryUsed: 0,
    };
  }
}

module.exports = { executeCode };