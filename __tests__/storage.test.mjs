import { afterEach, describe, expect, jest, test } from "@jest/globals";
import {
  loadFromStorage,
  removeFromStorage,
  saveToStorage,
} from "../src/utils/storage.js";

const originalWindow = global.window;

function installLocalStorageMock(initialValues = {}) {
  const store = new Map(Object.entries(initialValues));
  const localStorage = {
    getItem: jest.fn((key) => (store.has(key) ? store.get(key) : null)),
    removeItem: jest.fn((key) => store.delete(key)),
    setItem: jest.fn((key, value) => store.set(key, value)),
  };

  global.window = { localStorage };
  global.localStorage = localStorage;

  return localStorage;
}

describe("storage utilities", () => {
  afterEach(() => {
    global.window = originalWindow;
    delete global.localStorage;
    jest.restoreAllMocks();
  });

  test("saveToStorage serializes and stores values", () => {
    const localStorage = installLocalStorageMock();

    saveToStorage("settings", { theme: "dark" });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "settings",
      JSON.stringify({ theme: "dark" }),
    );
  });

  test("loadFromStorage parses stored JSON", () => {
    installLocalStorageMock({
      settings: JSON.stringify({ theme: "dark" }),
    });

    expect(loadFromStorage("settings", { theme: "light" })).toEqual({
      theme: "dark",
    });
  });

  test("loadFromStorage returns fallback for missing or invalid JSON", () => {
    installLocalStorageMock({ broken: "{not-json" });

    expect(loadFromStorage("missing", "fallback")).toBe("fallback");
    expect(loadFromStorage("broken", "fallback")).toBe("fallback");
  });

  test("removeFromStorage removes the requested key", () => {
    const localStorage = installLocalStorageMock();

    removeFromStorage("settings");

    expect(localStorage.removeItem).toHaveBeenCalledWith("settings");
  });

  test("all helpers are safe when window is unavailable", () => {
    delete global.window;
    delete global.localStorage;

    expect(() => saveToStorage("settings", { theme: "dark" })).not.toThrow();
    expect(loadFromStorage("settings", "fallback")).toBe("fallback");
    expect(() => removeFromStorage("settings")).not.toThrow();
  });
});
