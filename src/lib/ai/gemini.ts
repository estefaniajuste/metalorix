const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-lite";
const RETRY_DELAY_MS = 2500;

interface GeminiResponse {
  candidates?: Array<{
    content: { parts: Array<{ text: string }> };
    finishReason?: string;
  }>;
  error?: { message: string; code?: number };
  promptFeedback?: { blockReason?: string };
}

export interface GeminiLog {
  attempt: number;
  status?: number;
  error?: string;
  finishReason?: string;
  blockReason?: string;
  responseLength?: number;
}

export async function generateText(
  prompt: string,
  options?: { retryOnEmpty?: boolean; log?: (entry: GeminiLog) => void }
): Promise<string | null> {
  const retryOnEmpty = options?.retryOnEmpty ?? true;
  const log = options?.log;

  if (!GEMINI_API_KEY) {
    log?.({ attempt: 0, error: "GEMINI_API_KEY not set" });
    console.warn("[Gemini] GEMINI_API_KEY not set, skipping content generation");
    return null;
  }

  const attempt = async (attemptNum: number): Promise<string | null> => {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: 16384,
            },
          }),
        }
      );

      const body = await res.text();
      const data: GeminiResponse = body ? JSON.parse(body) : {};

      if (!res.ok) {
        const errMsg = data.error?.message ?? body?.slice(0, 300) ?? `HTTP ${res.status}`;
        log?.({ attempt: attemptNum, status: res.status, error: errMsg });
        console.error("[Gemini] API error:", res.status, errMsg);
        return null;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      const finishReason = data.candidates?.[0]?.finishReason;
      const blockReason = data.promptFeedback?.blockReason;

      log?.({
        attempt: attemptNum,
        status: res.status,
        finishReason,
        blockReason,
        responseLength: text?.length ?? 0,
      });

      if (!text || text.trim().length === 0) {
        console.warn(
          `[Gemini] Empty response (attempt ${attemptNum}), finishReason=${finishReason}, blockReason=${blockReason}`
        );
        return null;
      }
      return text;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      log?.({ attempt: attemptNum, error: errMsg });
      console.error("[Gemini] Generation failed:", err);
      return null;
    }
  };

  let result = await attempt(1);
  if (result === null && retryOnEmpty) {
    console.warn("[Gemini] First attempt returned null, retrying in 2.5s...");
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    result = await attempt(2);
  }
  return result;
}

export function isConfigured(): boolean {
  return !!GEMINI_API_KEY;
}
