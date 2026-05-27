export async function POST(req) {
  try {
    const body = await req.json();
    const { messages } = body;

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        {
          error: "Invalid messages array.",
        },
        { status: 400 }
      );
    }

    // Send request to OpenRouter using Gemma model
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  model: "openai/gpt-3.5-turbo",
  messages: messages,
}),
      }
    );

    const data = await response.json();

    console.log("OpenRouter Response:", data);

    // Handle API errors
    if (!response.ok) {
      return Response.json(
        {
          error:
            data?.error?.message ||
            "OpenRouter request failed.",
        },
        { status: 500 }
      );
    }

    // Extract assistant reply
    const replyText =
      data?.choices?.[0]?.message?.content;

    return Response.json({
      message: {
        role: "assistant",
        content: replyText || "No response generated.",
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
