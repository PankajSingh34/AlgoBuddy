import nodemailer from "nodemailer";
import { checkRateLimit, checkGlobalSmtpQuota } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { jsonResponse, errorResponse } from "@/lib/serverApi";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(value) {
  const email = String(value).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
  try {
    const ip = getClientIp(req.headers);

    const { allowed, remaining, resetAt } =
      await checkRateLimit(`contact:${ip}`);
    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      return jsonResponse({ message: "Too many requests. Please try again later." }, 429, {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": "5",
        "X-RateLimit-Remaining": "0",
      });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON body" }, 400);
    }

    const { name, email, subject, message, captchaToken } = body || {};

    if (!captchaToken) {
      return jsonResponse({ message: "Captcha token missing" }, 400);
    }

    const captcha = await verifyTurnstile(String(captchaToken), { ip });
    if (!captcha.ok) {
      return jsonResponse({ message: captcha.error }, 400);
    }

    const trimmedName = String(name || "").trim().slice(0, 80);
    const trimmedEmail = String(email || "").trim().slice(0, 254);
    const trimmedSubject = String(subject || "").trim().slice(0, 140);
    const trimmedMessage = String(message || "").trim().slice(0, 4000);

    if (!trimmedName) {
      return jsonResponse({ message: "Name is required" }, 400);
    }
    if (!isValidEmail(trimmedEmail)) {
      return jsonResponse({ message: "Valid email is required" }, 400);
    }
    if (!trimmedSubject) {
      return jsonResponse({ message: "Subject is required" }, 400);
    }
    if (!trimmedMessage) {
      return jsonResponse({ message: "Message is required" }, 400);
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return jsonResponse({ message: "Server misconfigured: email credentials missing" }, 500);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: trimmedEmail,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${trimmedSubject}`,
      text: `
        Name: ${trimmedName}
        Email: ${trimmedEmail}
        Subject: ${trimmedSubject}
        Message: ${trimmedMessage}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(trimmedSubject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(trimmedMessage).replaceAll("\n", "<br>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return jsonResponse({ message: "Email sent successfully" }, 200, {
      "X-RateLimit-Limit": "5",
      "X-RateLimit-Remaining": remaining.toString(),
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return errorResponse(error);
  }
}
