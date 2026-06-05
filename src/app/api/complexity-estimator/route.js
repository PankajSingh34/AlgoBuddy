import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SYSTEM_PROMPT = `You are an expert computer science assistant specialized in algorithmic analysis and DSA. Your task is to analyze the given code snippet for Time Complexity (Best, Average, and Worst cases using Big-O, Big-Theta, or Big-Omega notation) and Space Complexity. Additionally, if the code is sub-optimal (e.g., O(n^2) nested loops that can be optimized to O(n) using a hash map or sorting), provide a refactored version of the code in the same language along with a brief explanation of the optimization.

Guidelines:
1. "timeBest": Estimate the best-case time complexity (e.g., "O(1)", "O(log n)", "O(n)").
2. "timeAverage": Estimate the average-case time complexity (e.g., "O(n)", "O(n log n)").
3. "timeWorst": Estimate the worst-case time complexity (e.g., "O(n²)", "O(2ⁿ)").
4. "space": Estimate the auxiliary space complexity (excluding input size unless extra memory is directly proportional, e.g., "O(1)", "O(n)").
5. "explanation": Provide a step-by-step breakdown explaining the math and logic behind these complexity estimates. Use clean Markdown formatting, bullet points, and short, beginner-friendly explanations.
6. "optimizedCode": If the code is sub-optimal and can be optimized, provide the fully functional optimized code. If the code is already optimal or cannot be improved, leave this field as an empty string ("").
7. "optimizationJustification": Explain why the optimized code is better, or leave it empty if the code is already optimal.`;

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const parsed = new URL(supabaseUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  } catch {
    return null;
  }
  return { supabaseUrl, supabaseAnonKey };
}

async function getAuthenticatedUser() {
  const config = getSupabaseConfig();
  if (!config) {
    // Supabase not configured (local dev without env vars) — allow through
    return { user: null, configured: false };
  }

  const cookieStore = await cookies();
  const client = createServerClient(config.supabaseUrl, config.supabaseAnonKey, {
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

  const { data } = await client.auth.getUser();
  return { user: data?.user ?? null, configured: true };
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

    const { code, language } = body || {};

    if (!code || typeof code !== "string" || !code.trim()) {
      return Response.json({ error: "Missing or invalid 'code' string." }, { status: 400 });
    }
    if (code.length > 50000) {
      return Response.json({ error: "Code exceeds maximum allowed length (50,000 characters)." }, { status: 400 });
    }
    if (!language || typeof language !== "string") {
      return Response.json({ error: "Missing or invalid 'language' string." }, { status: 400 });
    }

    const ip = getClientIp(req.headers);

    // 2. Rate Limiting Check (5 attempts per minute per IP)
    const { allowed } = await checkRateLimit(`complexity:estimate:${ip}`);
    if (!allowed) {
      return Response.json(
        { error: "Too many requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    // 3. Authentication Check
    const { user, configured } = await getAuthenticatedUser();
    
    if (process.env.NODE_ENV === "production" && !configured) {
      return Response.json({ error: "Server misconfigured: Authentication environment variables are missing." }, { status: 500 });
    }
    
    if (configured && !user) {
      return Response.json({ error: "Authentication required." }, { status: 401 });
    }

    // 4. Gemini API Integration
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Gemini API Key is missing. Please add GEMINI_API_KEY to your env configuration." },
        { status: 500 }
      );
    }

    const userPrompt = `Language: ${language}\n\nCode to analyze:\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\``;

    // Send request to Google Gemini API using the Gemini 2.5 Flash model with Structured Outputs
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                timeBest: { type: "STRING" },
                timeAverage: { type: "STRING" },
                timeWorst: { type: "STRING" },
                space: { type: "STRING" },
                explanation: { type: "STRING" },
                optimizedCode: { type: "STRING" },
                optimizationJustification: { type: "STRING" },
              },
              required: [
                "timeBest",
                "timeAverage",
                "timeWorst",
                "space",
                "explanation",
                "optimizedCode",
                "optimizationJustification",
              ],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Gemini API request failed:", response.status, errorText);
      return Response.json(
        { error: "Gemini API request failed. Please check your key or try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const modelTextResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!modelTextResponse) {
      return Response.json(
        { error: "Received empty response from the AI model." },
        { status: 500 }
      );
    }

    // Since we requested responseMimeType: "application/json", the text should be a parseable JSON string
    try {
      const jsonResult = JSON.parse(modelTextResponse.trim());
      return Response.json(jsonResult);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON output:", parseError, modelTextResponse);
      return Response.json(
        { error: "Failed to parse complexity result from AI model." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Complexity Estimator API error:", error);
    return Response.json(
      { error: error.message || "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
