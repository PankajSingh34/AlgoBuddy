const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

// -------------------------------------------------------------------
// Functions under test — identical copies from src/app/api/chatbot/route.js
// -------------------------------------------------------------------

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0)
    return { valid: false, error: "messages must be a non-empty array." };

  for (const msg of messages) {
    if (!["user", "assistant"].includes(msg.role))
      return { valid: false, error: `Invalid role: "${msg.role}". Must be "user" or "assistant".` };
    if (typeof msg.content !== "string" || msg.content.trim().length === 0)
      return { valid: false, error: "Each message must have non-empty string content." };
    if (msg.content.length > 10000)
      return { valid: false, error: "Message content exceeds 10,000 character limit." };
  }
  return { valid: true };
}

function toGeminiContents(messages) {
  const contents = [];
  for (const msg of messages) {
    const role = msg.role === "assistant" ? "model" : "user";
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += "\n\n" + msg.content;
    } else {
      contents.push({
        role,
        parts: [{ text: msg.content }],
      });
    }
  }
  return contents;
}

// -------------------------------------------------------------------
// validateMessages tests
// -------------------------------------------------------------------

describe("validateMessages", () => {
  it("returns valid for a properly structured messages array", () => {
    const messages = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there" },
    ];
    assert.deepStrictEqual(validateMessages(messages), { valid: true });
  });

  it("returns invalid when messages is not an array (null)", () => {
    assert.deepStrictEqual(validateMessages(null), {
      valid: false,
      error: "messages must be a non-empty array.",
    });
  });

  it("returns invalid when messages is a string", () => {
    assert.deepStrictEqual(validateMessages("hello"), {
      valid: false,
      error: "messages must be a non-empty array.",
    });
  });

  it("returns invalid when messages is an object", () => {
    assert.deepStrictEqual(validateMessages({}), {
      valid: false,
      error: "messages must be a non-empty array.",
    });
  });

  it("returns invalid for empty array", () => {
    assert.deepStrictEqual(validateMessages([]), {
      valid: false,
      error: "messages must be a non-empty array.",
    });
  });

  it("returns invalid for messages with unrecognized role", () => {
    const messages = [{ role: "admin", content: "Hello" }];
    const result = validateMessages(messages);
    assert.strictEqual(result.valid, false);
    assert.ok(result.error.includes("Invalid role"));
    assert.ok(result.error.includes("admin"));
  });

  it("returns invalid for messages with null role", () => {
    const messages = [{ role: null, content: "Hello" }];
    const result = validateMessages(messages);
    assert.strictEqual(result.valid, false);
    assert.ok(result.error.includes("Invalid role"));
  });

  it("returns invalid when content is not a string", () => {
    const messages = [{ role: "user", content: 123 }];
    assert.deepStrictEqual(validateMessages(messages), {
      valid: false,
      error: "Each message must have non-empty string content.",
    });
  });

  it("returns invalid when content is empty string", () => {
    const messages = [{ role: "user", content: "" }];
    assert.deepStrictEqual(validateMessages(messages), {
      valid: false,
      error: "Each message must have non-empty string content.",
    });
  });

  it("returns invalid when content is only whitespace", () => {
    const messages = [{ role: "user", content: "   \n\t  " }];
    assert.deepStrictEqual(validateMessages(messages), {
      valid: false,
      error: "Each message must have non-empty string content.",
    });
  });

  it("returns invalid when content exceeds 10,000 characters", () => {
    const longContent = "a".repeat(10001);
    const messages = [{ role: "user", content: longContent }];
    assert.deepStrictEqual(validateMessages(messages), {
      valid: false,
      error: "Message content exceeds 10,000 character limit.",
    });
  });

  it("accepts content at exactly the 10,000 character boundary", () => {
    const boundaryContent = "a".repeat(10000);
    const messages = [{ role: "user", content: boundaryContent }];
    assert.deepStrictEqual(validateMessages(messages), { valid: true });
  });

  it("returns invalid on the first offending message", () => {
    const messages = [
      { role: "user", content: "Valid" },
      { role: "system", content: "Should fail here" },
    ];
    const result = validateMessages(messages);
    assert.strictEqual(result.valid, false);
    assert.ok(result.error.includes("Invalid role"));
    assert.ok(result.error.includes("system"));
  });
});

// -------------------------------------------------------------------
// toGeminiContents tests
// -------------------------------------------------------------------

describe("toGeminiContents", () => {
  it("returns empty array for empty message list", () => {
    assert.deepStrictEqual(toGeminiContents([]), []);
  });

  it("converts user role to 'user' in Gemini schema", () => {
    const messages = [{ role: "user", content: "Hello world" }];
    assert.deepStrictEqual(toGeminiContents(messages), [
      { role: "user", parts: [{ text: "Hello world" }] },
    ]);
  });

  it("converts assistant role to 'model' in Gemini schema", () => {
    const messages = [{ role: "assistant", content: "Hello back" }];
    assert.deepStrictEqual(toGeminiContents(messages), [
      { role: "model", parts: [{ text: "Hello back" }] },
    ]);
  });

  it("alternating user and assistant roles produce separate entries", () => {
    const messages = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi" },
      { role: "user", content: "How are you?" },
    ];
    const result = toGeminiContents(messages);
    assert.strictEqual(result.length, 3);
    assert.deepStrictEqual(result[0], { role: "user", parts: [{ text: "Hello" }] });
    assert.deepStrictEqual(result[1], { role: "model", parts: [{ text: "Hi" }] });
    assert.deepStrictEqual(result[2], { role: "user", parts: [{ text: "How are you?" }] });
  });

  it("consecutive user messages are merged with double newline separator", () => {
    const messages = [
      { role: "user", content: "First user turn" },
      { role: "user", content: "Second user turn" },
    ];
    const result = toGeminiContents(messages);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], {
      role: "user",
      parts: [{ text: "First user turn\n\nSecond user turn" }],
    });
  });

  it("consecutive assistant messages are merged with double newline separator", () => {
    const messages = [
      { role: "assistant", content: "First assistant" },
      { role: "assistant", content: "Second assistant" },
    ];
    const result = toGeminiContents(messages);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], {
      role: "model",
      parts: [{ text: "First assistant\n\nSecond assistant" }],
    });
  });

  it("handles a full conversation with alternating and consecutive roles", () => {
    const messages = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi" },
      { role: "assistant", content: "Still here" },
      { role: "user", content: "Good" },
    ];
    const result = toGeminiContents(messages);
    assert.strictEqual(result.length, 3);
    assert.deepStrictEqual(result[0], { role: "user", parts: [{ text: "Hello" }] });
    assert.deepStrictEqual(result[1], { role: "model", parts: [{ text: "Hi\n\nStill here" }] });
    assert.deepStrictEqual(result[2], { role: "user", parts: [{ text: "Good" }] });
  });
});
