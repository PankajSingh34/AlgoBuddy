import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CodeBlock from "@/app/components/ui/CodeBlock";
import { toast } from "react-hot-toast";

jest.mock("framer-motion", () => {
  const React = require("react");

  const passthrough = (Tag) => ({ children, whileHover, whileTap, ...props }) =>
    React.createElement(Tag, props, children);

  return {
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: {
      div: passthrough("div"),
      button: passthrough("button"),
      span: passthrough("span"),
    },
  };
});

jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const codeExamples = {
  javascript: "function sum(arr) {\n  return arr.reduce((acc, value) => acc + value, 0);\n}",
  python: "def sum_values(arr):\n    return sum(arr)",
  java: "class SumValues {\n  int sum(int[] arr) { return 0; }\n}",
  c: "int sum(int* arr) {\n  return 0;\n}",
  cpp: "int sum(std::vector<int>& arr) {\n  return 0;\n}",
};

const fileNames = {
  javascript: "sum.js",
  python: "sum.py",
  java: "Sum.java",
  c: "sum.c",
  cpp: "sum.cpp",
};

describe("CodeBlock copy button", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore?.();
  });

  it("copies the currently displayed language code and shows success feedback", async () => {
    const user = userEvent.setup();

    render(<CodeBlock variant="standard" title="Example" codeExamples={codeExamples} fileNames={fileNames} />);

    const copyButton = screen.getByRole("button", { name: /copy code/i });
    expect(copyButton).toHaveAttribute("aria-label", "Copy code");
    expect(copyButton.className).toContain("focus-visible:ring-2");

    await user.click(screen.getByRole("button", { name: /python/i }));
    expect(
      screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === "code" && element.textContent === codeExamples.python;
      })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /copy code/i }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Code copied!"));
  });

  it("shows an error toast when copying fails", async () => {
    const user = userEvent.setup();

    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });

    render(<CodeBlock variant="standard" title="Example" codeExamples={codeExamples} fileNames={fileNames} />);

    await user.click(screen.getByRole("button", { name: /copy code/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Could not copy code."));
  });
});