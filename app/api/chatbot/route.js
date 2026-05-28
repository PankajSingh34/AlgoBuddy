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
          messages,
          stream: true
        }),
      }
    );

    
    // Handle API errors
    if (!response.ok) {
      return Response.json(
        {
          error:
            "OpenRouter request failed.",
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

                // End of stream
                if (data === "[DONE]") {
                  controller.close();
                  return;
                }

                try {
                  const json = JSON.parse(data);

                  const content =
                    json?.choices?.[0]?.delta?.content;

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
