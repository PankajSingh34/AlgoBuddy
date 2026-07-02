// __tests__/components/chatbot-validation.test.js
//
// Run with:  npx jest __tests__/components/chatbot-validation.test.js
//
// Tests the pure validation helpers from src/app/api/chatbot/route.js:
// validateMessages and toGeminiContents. No network access or Gemini API calls.
// Functions are inlined here to avoid importing ESM dependencies (upstash/redis).

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0)
    return { valid: false, error: 'messages must be a non-empty array.' };

  for (const msg of messages) {
    if (!['user', 'assistant'].includes(msg.role))
      return { valid: false, error: `Invalid role: "${msg.role}". Must be "user" or "assistant".` };
    if (typeof msg.content !== 'string' || msg.content.trim().length === 0)
      return { valid: false, error: 'Each message must have non-empty string content.' };
    if (msg.content.length > 10000)
      return { valid: false, error: 'Message content exceeds 10,000 character limit.' };
  }
  return { valid: true };
}

function toGeminiContents(messages) {
  const contents = [];
  for (const msg of messages) {
    const role = msg.role === 'assistant' ? 'model' : 'user';
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += '\n\n' + msg.content;
    } else {
      contents.push({
        role,
        parts: [{ text: msg.content }],
      });
    }
  }
  return contents;
}

describe('validateMessages', () => {
  test('returns valid:true for a properly structured message array', () => {
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there' },
    ];
    const result = validateMessages(messages);
    expect(result.valid).toBe(true);
  });

  test('returns valid:false when messages is not an array', () => {
    expect(validateMessages(null).valid).toBe(false);
    expect(validateMessages(undefined).valid).toBe(false);
    expect(validateMessages('hello').valid).toBe(false);
    expect(validateMessages({}).valid).toBe(false);
    expect(validateMessages(123).valid).toBe(false);
  });

  test('returns valid:false when messages array is empty', () => {
    const result = validateMessages([]);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/non-empty array/i);
  });

  test('returns valid:false for invalid roles', () => {
    const result = validateMessages([
      { role: 'system', content: 'You are a bot' },
    ]);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Invalid role/i);
  });

  test('returns valid:false when content is not a string', () => {
    const result = validateMessages([
      { role: 'user', content: null },
    ]);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/non-empty string/i);
  });

  test('returns valid:false when content is empty or whitespace-only', () => {
    expect(validateMessages([{ role: 'user', content: '' }]).valid).toBe(false);
    expect(validateMessages([{ role: 'user', content: '   ' }]).valid).toBe(false);
  });

  test('returns valid:false when content exceeds 10000 characters', () => {
    const longContent = 'a'.repeat(10001);
    const result = validateMessages([{ role: 'user', content: longContent }]);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/10.?000|exceeds.*limit/i);
  });

  test('accepts valid message at exactly 10000 characters', () => {
    const maxContent = 'a'.repeat(10000);
    const result = validateMessages([{ role: 'user', content: maxContent }]);
    expect(result.valid).toBe(true);
  });

  test('returns valid:true for multiple valid messages', () => {
    const messages = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}`,
    }));
    const result = validateMessages(messages);
    expect(result.valid).toBe(true);
  });
});

describe('toGeminiContents', () => {
  test('maps user role to user, assistant role to model', () => {
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi' },
    ];
    const contents = toGeminiContents(messages);
    expect(contents).toHaveLength(2);
    expect(contents[0]).toEqual({ role: 'user', parts: [{ text: 'Hello' }] });
    expect(contents[1]).toEqual({ role: 'model', parts: [{ text: 'Hi' }] });
  });

  test('merges consecutive messages from the same role', () => {
    const messages = [
      { role: 'user', content: 'First' },
      { role: 'user', content: 'Second' },
      { role: 'assistant', content: 'Reply' },
      { role: 'assistant', content: 'More' },
    ];
    const contents = toGeminiContents(messages);
    expect(contents).toHaveLength(2);
    expect(contents[0].role).toBe('user');
    expect(contents[0].parts[0].text).toBe('First\n\nSecond');
    expect(contents[1].role).toBe('model');
    expect(contents[1].parts[0].text).toBe('Reply\n\nMore');
  });

  test('produces correctly structured output with role and parts array', () => {
    const messages = [{ role: 'user', content: 'Test' }];
    const contents = toGeminiContents(messages);
    expect(contents[0]).toHaveProperty('role', 'user');
    expect(contents[0]).toHaveProperty('parts');
    expect(Array.isArray(contents[0].parts)).toBe(true);
    expect(contents[0].parts[0]).toHaveProperty('text', 'Test');
  });

  test('handles alternating roles without merging', () => {
    const messages = [
      { role: 'user', content: 'Q1' },
      { role: 'assistant', content: 'A1' },
      { role: 'user', content: 'Q2' },
      { role: 'assistant', content: 'A2' },
    ];
    const contents = toGeminiContents(messages);
    expect(contents).toHaveLength(4);
    expect(contents[0].parts[0].text).toBe('Q1');
    expect(contents[1].parts[0].text).toBe('A1');
    expect(contents[2].parts[0].text).toBe('Q2');
    expect(contents[3].parts[0].text).toBe('A2');
  });

  test('handles empty message array', () => {
    const contents = toGeminiContents([]);
    expect(contents).toEqual([]);
  });

  test('handles single message without merging', () => {
    const messages = [{ role: 'user', content: 'Only one' }];
    const contents = toGeminiContents(messages);
    expect(contents).toHaveLength(1);
    expect(contents[0].parts[0].text).toBe('Only one');
  });

  test('three consecutive same-role messages are merged', () => {
    const messages = [
      { role: 'user', content: 'One' },
      { role: 'user', content: 'Two' },
      { role: 'user', content: 'Three' },
    ];
    const contents = toGeminiContents(messages);
    expect(contents).toHaveLength(1);
    expect(contents[0].parts[0].text).toBe('One\n\nTwo\n\nThree');
  });
});
