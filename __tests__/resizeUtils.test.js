import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { createDebouncedResizeHandler } from "../src/app/visualizer/components/resizeUtils.js";

describe("createDebouncedResizeHandler", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("debounces repeated resize events and only runs once", () => {
    const callback = jest.fn();
    const handler = createDebouncedResizeHandler(callback, 120);

    handler();
    handler();
    handler();

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(119);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("cancel prevents a pending resize callback from running", () => {
    const callback = jest.fn();
    const handler = createDebouncedResizeHandler(callback, 120);

    handler();
    handler.cancel();
    jest.advanceTimersByTime(120);

    expect(callback).not.toHaveBeenCalled();
  });
});
