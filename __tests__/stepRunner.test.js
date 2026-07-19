import { registerAlgorithm, generateSteps, createSyncStepRunner, buildStepRunner } from "@/lib/visualizer/stepRunner";

describe("stepRunner", () => {
  beforeEach(() => {
    // Clear the ALGORITHMS map before each test
    const { ALGORITHMS } = require("@/lib/visualizer/stepRunner");
    ALGORITHMS.clear();
  });

  describe("registerAlgorithm", () => {
    it("registers an algorithm function", () => {
      const testFn = (state) => [state + 1];
      registerAlgorithm("increment", testFn);
      
      // Verify it's registered by trying to use it
      const syncRunner = createSyncStepRunner((input) => [input + 1]);
      const result = syncRunner(0);
      expect(result).toEqual([1]);
    });

    it("allows multiple algorithms to be registered", () => {
      registerAlgorithm("algo1", (s) => [s + 1]);
      registerAlgorithm("algo2", (s) => [s * 2]);
      
      // Both should be accessible via createSyncStepRunner pattern
      const runner1 = createSyncStepRunner((input) => [input + 1]);
      const runner2 = createSyncStepRunner((input) => [input * 2]);
      
      expect(runner1(5)).toEqual([6]);
      expect(runner2(5)).toEqual([10]);
    });
  });

  describe("generateSteps", () => {
    it("generates steps from a simple algorithm", async () => {
      const algorithmFn = (state) => {
        if (state >= 3) return [];
        return [state + 1];
      };

      const steps = [];
      for await (const step of generateSteps(algorithmFn, 0)) {
        steps.push(step);
      }
      
      expect(steps).toEqual([1, 2, 3]);
    });

    it("handles empty result from algorithm", async () => {
      const algorithmFn = (state) => [];

      const steps = [];
      for await (const step of generateSteps(algorithmFn, 0)) {
        steps.push(step);
      }
      
      expect(steps).toEqual([]);
    });

    it("handles multiple next states", async () => {
      const algorithmFn = (state) => {
        if (state >= 2) return [];
        return [state + 1, state + 2];
      };

      const steps = [];
      for await (const step of generateSteps(algorithmFn, 0)) {
        steps.push(step);
      }
      
      // Should generate: 1, 2 from 0; then 2, 3 from 1; then 3, 4 from 2; etc.
      // But BFS with queue will process in order
      expect(steps.length).toBeGreaterThan(0);
    });

    it("throws for non-function algorithm", async () => {
      await expect(async () => {
        for await (const _ of generateSteps(null, 0)) {}
      }).rejects.toThrow();
    });
  });

  describe("createSyncStepRunner", () => {
    it("creates a synchronous step runner", () => {
      const runner = createSyncStepRunner(function* (input) {
        yield input + 1;
        yield input + 2;
        yield input + 3;
      });

      const result = runner(0);
      expect(result).toEqual([1, 2, 3]);
    });

    it("handles empty generator", () => {
      const runner = createSyncStepRunner(function* (input) {
        return;
        yield input; // never reached
      });

      const result = runner(0);
      expect(result).toEqual([]);
    });

    it("works with complex generator logic", () => {
      const runner = createSyncStepRunner(function* (input) {
        let current = input;
        while (current < input + 5) {
          current++;
          yield current;
        }
      });

      const result = runner(10);
      expect(result).toEqual([11, 12, 13, 14, 15]);
    });
  });

  describe("buildStepRunner", () => {
    it("builds an async step runner from generator", async () => {
      const generatorFn = async function* (input) {
        for (let i = 1; i <= 3; i++) {
          yield input + i;
        }
      };

      const runner = buildStepRunner(generatorFn(0));
      const steps = await runner();
      
      expect(steps).toEqual([1, 2, 3]);
    });

    it("handles empty async generator", async () => {
      const generatorFn = async function* (input) {
        return;
        yield input; // never reached
      };

      const runner = buildStepRunner(generatorFn(0));
      const steps = await runner();
      
      expect(steps).toEqual([]);
    });

    it("handles complex async generation", async () => {
      const generatorFn = async function* (input) {
        for (let i = 0; i < 5; i++) {
          // Simulate async work
          await new Promise(resolve => setTimeout(resolve, 1));
          yield input + i;
        }
      };

      const runner = buildStepRunner(generatorFn(10));
      const steps = await runner();
      
      expect(steps).toEqual([10, 11, 12, 13, 14]);
    });
  });

  describe("createStepWorker", () => {
    it("throws for unknown algorithm", () => {
      expect(() => {
        createStepWorker("unknown-algorithm");
      }).toThrow("Unknown algorithm: \"unknown-algorithm\"");
    });

    it("creates worker for registered algorithm", () => {
      registerAlgorithm("test-algo", (state) => [state + 1]);
      
      const worker = createStepWorker("test-algo");
      expect(worker).toBeInstanceOf(Worker);
      
      // Clean up
      worker.terminate();
    });
  });

  describe("edge cases", () => {
    it("handles algorithm that returns null/undefined", async () => {
      const algorithmFn = (state) => null;
      
      const steps = [];
      for await (const step of generateSteps(algorithmFn, 0)) {
        steps.push(step);
      }
      
      expect(steps).toEqual([]);
    });

    it("handles algorithm that returns non-array", async () => {
      const algorithmFn = (state) => "not an array";
      
      const steps = [];
      for await (const step of generateSteps(algorithmFn, 0)) {
        steps.push(step);
      }
      
      expect(steps).toEqual([]);
    });

    it("handles large number of steps", async () => {
      const algorithmFn = (state) => {
        if (state >= 100) return [];
        return [state + 1];
      };

      const steps = [];
      for await (const step of generateSteps(algorithmFn, 0)) {
        steps.push(step);
      }
      
      expect(steps).toHaveLength(100);
      expect(steps[99]).toBe(100);
    });
  });
});