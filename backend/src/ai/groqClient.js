/**
 * Groq AI client (groq-sdk) — powers all Week 2 AI agents.
 * Configure GROQ_API_KEY in .env (console.groq.com).
 */
import Groq from "groq-sdk";

export const GROQ_MODEL = "llama-3.3-70b-versatile";

let groqClient = null;

export const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined in environment variables");
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  return groqClient;
};

export const logAiError = (operation, error, meta = {}) => {
  console.error(`[Groq AI] ${operation} failed`, {
    timestamp: new Date().toISOString(),
    model: GROQ_MODEL,
    message: error?.message,
    status: error?.status,
    code: error?.code,
    type: error?.type,
    error: error?.error,
    stack: error?.stack,
    ...meta,
  });
};

export const parseJsonFromResponse = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("AI response was empty or invalid");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

const isRetryableError = (error) => {
  const status = error?.status;
  const message = error?.message || "";
  return (
    status === 429 ||
    status === 503 ||
    message.includes("429") ||
    message.includes("503") ||
    message.toLowerCase().includes("rate limit")
  );
};

/**
 * @param {{ operation: string, messages: Array, jsonMode?: boolean, retries?: number }} options
 */
export const chatCompletion = async ({
  operation,
  messages,
  jsonMode = false,
  retries = 3,
}) => {
  const client = getGroqClient();

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: GROQ_MODEL,
        messages,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response content from Groq");
      }

      if (attempt > 0) {
        console.info(`[Groq AI] ${operation} succeeded after retry`, {
          attempt: attempt + 1,
          model: GROQ_MODEL,
        });
      }

      return content;
    } catch (error) {
      logAiError(operation, error, {
        attempt: attempt + 1,
        maxAttempts: retries,
        jsonMode,
      });

      if (isRetryableError(error) && attempt < retries - 1) {
        const delayMs = Math.pow(2, attempt) * 1500;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      throw error;
    }
  }

  throw new Error(`[Groq AI] ${operation} failed after ${retries} attempts`);
};

export const checkGroqHealth = async () => {
  const startedAt = Date.now();

  if (!process.env.GROQ_API_KEY) {
    return {
      ok: false,
      provider: "groq",
      model: GROQ_MODEL,
      reason: "GROQ_API_KEY is not configured",
      latencyMs: 0,
    };
  }

  try {
    const content = await chatCompletion({
      operation: "health-check",
      messages: [
        {
          role: "user",
          content: 'Reply with JSON only: {"status":"ok"}',
        },
      ],
      jsonMode: true,
      retries: 1,
    });

    const parsed = parseJsonFromResponse(content);

    return {
      ok: parsed?.status === "ok",
      provider: "groq",
      model: GROQ_MODEL,
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    logAiError("health-check", error);
    return {
      ok: false,
      provider: "groq",
      model: GROQ_MODEL,
      reason: error.message,
      latencyMs: Date.now() - startedAt,
    };
  }
};
