const realFetch = global.fetch;

beforeEach(() => {
  delete process.env.RESEND_API_KEY;
  global.fetch = realFetch;
});

afterAll(() => {
  global.fetch = realFetch;
});

describe("sendEmail", () => {
  test("skips sending when RESEND_API_KEY is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    jest.resetModules();
    const { sendEmail } = await import("../src/lib/email");
    const result = await sendEmail({ to: "test@example.com", subject: "Test", html: "<p>Hi</p>" });
    expect(result.success).toBe(false);
    expect(result.skipped).toBe(true);
  });

  test("sends email successfully when API key is configured", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => "" });
    jest.resetModules();
    const { sendEmail } = await import("../src/lib/email");

    const result = await sendEmail({ to: "user@example.com", subject: "Hello", html: "<p>World</p>" });
    expect(result.success).toBe(true);
  });

  test("sends correct payload to Resend API", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    jest.resetModules();
    const { sendEmail } = await import("../src/lib/email");
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, text: async () => "" });
    global.fetch = mockFetch;

    await sendEmail({ to: "a@b.com", subject: "Subj", html: "<b>content</b>" });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Authorization": "Bearer re_test_key" }),
      })
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.to).toBe("a@b.com");
    expect(body.subject).toBe("Subj");
    expect(body.html).toBe("<b>content</b>");
  });

  test("returns error when Resend API returns non-ok", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    jest.resetModules();
    const { sendEmail } = await import("../src/lib/email");
    global.fetch = jest.fn().mockResolvedValue({ ok: false, text: async () => "Rate limit exceeded" });

    const result = await sendEmail({ to: "test@example.com", subject: "Test", html: "<p>Hi</p>" });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test("handles network errors gracefully", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    jest.resetModules();
    const { sendEmail } = await import("../src/lib/email");
    global.fetch = jest.fn().mockRejectedValue(new Error("Connection refused"));

    const result = await sendEmail({ to: "test@example.com", subject: "Test", html: "<p>Hi</p>" });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/connection refused/i);
  });
});
