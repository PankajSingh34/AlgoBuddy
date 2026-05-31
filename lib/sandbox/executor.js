const vm = require("vm");
const { EXECUTION_STATUS } = require("./errorCodes");
const { MAX_TIMEOUT_MS, MAX_MEMORY_MB, MAX_OUTPUT_LENGTH } = require("./sandbox.config");

async function executeCode(code) {
  const startTime = Date.now();
  const outputLines = [];

  try {
    const sandbox = {
      console: {
        log:   (...a) => outputLines.push(a.map(String).join(" ")),
        warn:  (...a) => outputLines.push("[warn] " + a.map(String).join(" ")),
        error: (...a) => outputLines.push("[error] " + a.map(String).join(" ")),
        info:  (...a) => outputLines.push("[info] " + a.map(String).join(" ")),
      },
    };

    const context = vm.createContext(sandbox);

    const script = new vm.Script(code, { filename: "user-code.js" });

    script.runInContext(context, { timeout: MAX_TIMEOUT_MS });

    const rawOutput = outputLines.join("\n");
    const output = rawOutput.length > MAX_OUTPUT_LENGTH
      ? rawOutput.slice(0, MAX_OUTPUT_LENGTH) + "\n… (output truncated)"
      : rawOutput;

    return {
      status: EXECUTION_STATUS.SUCCESS,
      output,
      executionTime: Date.now() - startTime,
      memoryUsed: process.memoryUsage().heapUsed,
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

    return {
      status: EXECUTION_STATUS.RUNTIME_ERROR,
      output: outputLines.join("\n"),
      error: err.message ?? String(err),
      executionTime: elapsed,
      memoryUsed: 0,
    };
  }
}

module.exports = { executeCode };