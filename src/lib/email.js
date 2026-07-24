import { createLogger } from "./logger.js";

const log = createLogger("email");

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    log.warn("RESEND_API_KEY not configured. Skipping email send.");
    return { success: false, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AlgoBuddy <notifications@algobuddy.com>",
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      log.error({ statusCode: res.status, resendError: err }, "Resend API error.");
      return { success: false, error: err };
    }

    return { success: true };
  } catch (error) {
    log.error({ err: error }, "Failed to send email.");
    return { success: false, error: error.message };
  }
}
