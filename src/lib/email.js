import { getTransporter } from "./emailTransporter";

export async function sendEmail({ to, subject, html }) {
  try {
    const transporter = getTransporter();
    
    // We expect EMAIL_USER to be set for the sender email
    const fromEmail = process.env.EMAIL_USER || "notifications@algobuddy.com";

    await transporter.sendMail({
      from: `AlgoBuddy <${fromEmail}>`,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("[/lib/email] Failed to send email via SMTP:", error);
    return { success: false, error: error.message };
  }
}
