const { parentPort, workerData } = require("worker_threads");
const vm = require("vm");

const { code, MAX_TIMEOUT_MS, MAX_OUTPUT_LENGTH } = workerData;
const outputLines = [];

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

  parentPort.postMessage({ status: "success", output });
} catch (err) {
  const isTimeout =
    err.code === "ERR_SCRIPT_EXECUTION_TIMEOUT" ||
    (err.message && (err.message.includes("timed out") || err.message.includes("timeout")));

  const isMemory =
    err.message && (
      err.message.includes("memory") ||
      err.message.includes("allocation") ||
      err.message.includes("heap")
    );

  parentPort.postMessage({
    status: isTimeout ? "timeout" : isMemory ? "memory" : "error",
    output: outputLines.join("\n"),
    error: err.message ?? String(err),
  });
}
