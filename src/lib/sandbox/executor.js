const { Worker } = require("worker_threads");
const path = require("path");
const { EXECUTION_STATUS } = require("./errorCodes");
const { MAX_TIMEOUT_MS, MAX_MEMORY_MB, MAX_OUTPUT_LENGTH } = require("./sandbox.config");

async function executeCode(code) {
  const startTime = Date.now();

  return new Promise((resolve) => {
    let settled = false;

    const worker = new Worker(path.join(__dirname, "sandbox-worker.js"), {
      workerData: { code, MAX_TIMEOUT_MS, MAX_OUTPUT_LENGTH },
      resourceLimits: { maxOldGenerationSizeMb: MAX_MEMORY_MB },
    });

    const killTimer = setTimeout(() => {
      if (settled) return;
      settled = true;
      worker.terminate();
      resolve({
        status: EXECUTION_STATUS.TLE,
        output: "",
        error: `Your code exceeded the ${MAX_TIMEOUT_MS}ms time limit.`,
        executionTime: Date.now() - startTime,
        memoryUsed: 0,
      });
    }, MAX_TIMEOUT_MS + 2000);

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(killTimer);
      resolve(result);
    };

    worker.on("message", (msg) => {
      const elapsed = Date.now() - startTime;

      switch (msg.status) {
        case "success":
          finish({ status: EXECUTION_STATUS.SUCCESS, output: msg.output, executionTime: elapsed, memoryUsed: 0 });
          break;
        case "timeout":
          finish({ status: EXECUTION_STATUS.TLE, output: msg.output, error: `Your code exceeded the ${MAX_TIMEOUT_MS}ms time limit.`, executionTime: elapsed, memoryUsed: 0 });
          break;
        case "memory":
          finish({ status: EXECUTION_STATUS.MLE, output: msg.output, error: `Your code used too much memory (exceeded ${MAX_MEMORY_MB} MB).`, executionTime: elapsed, memoryUsed: 0 });
          break;
        default:
          finish({ status: EXECUTION_STATUS.RUNTIME_ERROR, output: msg.output, error: msg.error, executionTime: elapsed, memoryUsed: 0 });
      }
    });

    worker.on("error", (err) => {
      finish({ status: EXECUTION_STATUS.RUNTIME_ERROR, output: "", error: err.message ?? String(err), executionTime: Date.now() - startTime, memoryUsed: 0 });
    });

    worker.on("exit", (exitCode) => {
      if (!settled) {
        finish({ status: EXECUTION_STATUS.RUNTIME_ERROR, output: "", error: `Worker exited with code ${exitCode}`, executionTime: Date.now() - startTime, memoryUsed: 0 });
      }
    });
  });
}

module.exports = { executeCode };
