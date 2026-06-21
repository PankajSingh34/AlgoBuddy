import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/serverApi";
import nodemailer from "nodemailer";

export async function GET(req) {
  // Add a simple cron secret check to prevent unauthorized execution
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  
  try {
    // Fetch pending messages
    const { data: pendingMessages, error } = await supabase
      .from("pending_messages")
      .select("*")
      .is("sent_at", null)
      .limit(50);

    if (error) throw error;
    if (!pendingMessages || pendingMessages.length === 0) {
      return NextResponse.json({ message: "No pending messages to process." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let processedCount = 0;

    for (const msg of pendingMessages) {
      if (msg.type === "contact") {
        const { name, email, subject, message } = msg.payload;
        
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          replyTo: email,
          to: process.env.EMAIL_USER,
          subject: `[DELAYED] New Contact Form Submission: ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
        });

        // Mark as sent
        await supabase
          .from("pending_messages")
          .update({ sent_at: new Date().toISOString() })
          .eq("id", msg.id);
          
        processedCount++;
      }
    }

    return NextResponse.json({ message: `Successfully processed ${processedCount} pending messages.` });

  } catch (error) {
    console.error("[CRON] Error processing pending messages:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
