const vm = require("vm");

function testSandboxEscape() {
  const code = `
    try {
      // Attempt escape via console.log
      const hostFunction = console.log.constructor.constructor;
      const hostProcess = hostFunction('return process')();
      if (hostProcess) {
        console.log("ESCAPE SUCCESSFUL! Host process env:", hostProcess.env.NODE_ENV);
      } else {
        console.log("Escape failed (hostProcess is undefined).");
      }
    } catch (e) {
      console.log("Escape failed with error: " + e.message);
    }
  `;

  // 1. Current vulnerable approach
  console.log("--- Running vulnerable sandbox ---");
  try {
    const outputLines = [];
    const sandbox = Object.create(null);
    sandbox.console = {
      log: (...a) => outputLines.push(a.map(String).join(" ")),
    };
    const context = vm.createContext(sandbox);
    vm.runInContext(code, context);
    console.log("Vulnerable Sandbox Output:", outputLines.join("\n"));
  } catch (e) {
    console.error("Vulnerable sandbox error:", e);
  }

  // 2. Proposed secure approach
  console.log("\n--- Running hardened sandbox ---");
  try {
    const context = vm.createContext(Object.create(null));
    vm.runInContext(`
      (function() {
        const outputLines = [];
        globalThis.outputLines = outputLines;
        globalThis.console = {
          log: function(...a) { outputLines.push(a.map(String).join(" ")); },
          warn: function(...a) { outputLines.push("[warn] " + a.map(String).join(" ")); },
          error: function(...a) { outputLines.push("[error] " + a.map(String).join(" ")); },
          info: function(...a) { outputLines.push("[info] " + a.map(String).join(" ")); },
        };
        Object.freeze(Object.prototype);
        Object.freeze(Array.prototype);
        Object.freeze(Function.prototype);
      })();
    `, context);

    const script = new vm.Script(code);
    script.runInContext(context, { timeout: 1000 });
    
    // Read the output lines from the context safely
    const outputLines = context.outputLines;
    console.log("Hardened Sandbox Output:", outputLines.join("\n"));
  } catch (e) {
    console.error("Hardened sandbox error:", e);
  }
}

testSandboxEscape();
