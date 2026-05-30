import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const MAX_MESSAGES_PER_REQUEST = 20;
const MAX_TOTAL_CHARS = 4000;
const MAX_PER_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `You are the AlgoBuddy AI Assistant, an interactive helper for students and developers learning Data Structures and Algorithms (DSA). Your goal is to explain concepts in simple, easy-to-understand words, avoid jargon where possible, and provide clear step-by-step guidance.

Capabilities & Guidelines:
1. Explain concepts step-by-step (e.g., how a queue works, how quicksort partitions elements).
2. Answer user doubts in a friendly, supportive, and beginner-friendly tone.
3. Explain code line-by-line. Highlight what each variable represents and what each loop/conditional accomplishes.
4. Help beginners understand time and space complexity (Big O notation) using intuitive analogies.
5. Give simple examples and quiz help. Do not give direct answers immediately if the user is asking a quiz question; instead, guide them to the answer by explaining the underlying concept and asking leading questions.
6. Format your responses using clean Markdown. Use headings, bullet points, bold text, and code blocks with language specifiers for syntax highlighting.
7. Keep responses concise and structured. Do not overwhelm the user with walls of text.
8. If asked about something unrelated to programming, computer science, or DSA, politely redirect the conversation back to algorithms and data structures.`;

function validatePayload(messages) {
  if (!messages || !Array.isArray(messages)) {
    return "Invalid or missing 'messages' array.";
  }
  if (messages.length > MAX_MESSAGES_PER_REQUEST) {
    return `Cannot process more than ${MAX_MESSAGES_PER_REQUEST} messages at once.`;
  }

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (typeof msg.content !== "string") {
      return `Message content at index ${i} must be a string.`;
    }
    if (msg.content.length > MAX_PER_MESSAGE_LENGTH) {
      return `Message at index ${i} exceeds ${MAX_PER_MESSAGE_LENGTH} characters.`;
    }
  }

  const totalChars = messages.reduce((sum, message) => sum + message.content.length, 0);
  if (totalChars > MAX_TOTAL_CHARS) {
    return `Total message content exceeds ${MAX_TOTAL_CHARS} characters.`;
  }

  return null;
}

function createGeminiContents(messages) {
  return [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }],
    },
    {
      role: "model",
      parts: [
        {
          text: "Understood! I am the AlgoBuddy AI Assistant, ready to help you learn DSA. What would you like to know?",
        },
      ],
    },
    ...messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
  ];
}

export async function POST(req) {
  try {
    // 1. Parse Request Body
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const { messages, captchaToken } = body || {};

    // 2. Turnstile Captcha Verification
    if (!captchaToken) {
      return Response.json({ error: "Captcha token missing. Please refresh the page and try again." }, { status: 403 });
    }
    
    const ip = getClientIp(req.headers);
    const captcha = await verifyTurnstile(String(captchaToken), { ip });
    if (!captcha.ok) {
      return Response.json({ error: captcha.error }, { status: 403 });
    }

    // 3. Validate Messages Payload
    const validationError = validatePayload(messages);
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    // 4. Rate Limiting Check
    const { allowed } = await checkRateLimit(`chatbot:${ip}`);
    if (!allowed) {
      return Response.json(
        { error: "Too many messages. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    // 5. Authentication Check
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json({ error: "Auth server is not configured." }, { status: 500 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    // 6. Gemini API Integration
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Gemini API Key is missing. Please add GEMINI_API_KEY to your env configuration." },
        { status: 500 }
      );
    }

    // Send request to Google Gemini API using the Gemini 2.5 Flash model
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: createGeminiContents(messages),
        }),
      }
    );

    
    // Handle API errors
    if (!response.ok) {
      return Response.json(
        {
          error:
            "Gemini API request failed.",
        },
        { status: 500 }
      );
    }

    // Extract assistant reply
    
    if (!response.body) {
      return Response.json(
        {
          error: "No response stream available.",
        },
        { status: 500 }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            const chunk = decoder.decode(value);

            // SSE messages come line-by-line
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.replace("data: ", "").trim();

                try {
                  const json = JSON.parse(data);

                  const content =
                    json?.candidates?.[0]?.content?.parts?.[0]?.text;

                  if (content) {
                    controller.enqueue(
                      encoder.encode(content)
                    );
                  }
                } catch (err) {
                  console.error(
                    "Stream parsing error:",
                    err
                  );
                }
              }
            }
          }

          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          controller.error(err);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chatbot API error:", error);

    return Response.json(
      {
        error:
          error.message ||
          "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
} 
