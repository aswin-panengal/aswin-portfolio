import { streamText, embed } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { QdrantClient } from "@qdrant/js-client-rest";

if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
if (!process.env.GROQ_API_KEY)   throw new Error("Missing GROQ_API_KEY");
if (!process.env.QDRANT_API_KEY) throw new Error("Missing QDRANT_API_KEY");
if (!process.env.QDRANT_URL)     throw new Error("Missing QDRANT_URL");

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
const groq   = createGroq({ apiKey: process.env.GROQ_API_KEY });
const qdrant = new QdrantClient({ url: process.env.QDRANT_URL, apiKey: process.env.QDRANT_API_KEY });

// ── In-memory rate limiter (per Vercel instance; Upstash Redis for cross-instance) ──
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT    = 20;
const RATE_WINDOW   = 60_000;

function checkRateLimit(ip: string): boolean {
  const now   = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

interface RawMessage {
  role: string;
  content: string | { text?: string } | unknown;
}

export async function POST(req: Request) {
  try {
    // ── Content-Type guard ──────────────────────────────────────────────────
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return new Response("Unsupported Media Type", { status: 415 });
    }

    // ── Rate limiting ───────────────────────────────────────────────────────
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (!checkRateLimit(clientIp)) {
      return new Response("Too many requests. Please try again later.", { status: 429 });
    }

    const body = await req.json() as { messages?: unknown };
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return new Response("Invalid request", { status: 400 });
    }

    type AllowedRole = "user" | "assistant" | "system";
    const ALLOWED_ROLES = new Set<string>(["user", "assistant", "system"]);

    const normalizedMessages = (messages as RawMessage[])
      .filter((m) => ALLOWED_ROLES.has(m.role))
      .map((message) => ({
        role: message.role as AllowedRole,
        content:
          typeof message.content === "string"
            ? message.content.slice(0, 2000)
            : typeof message.content === "object" && message.content !== null && "text" in (message.content as object)
            ? String((message.content as { text: unknown }).text ?? "")
            : JSON.stringify(message.content ?? ""),
      }));

    // ── Guard: all messages had invalid roles ───────────────────────────────
    if (normalizedMessages.length === 0) {
      return new Response("Invalid request", { status: 400 });
    }

    const lastMessage         = normalizedMessages[normalizedMessages.length - 1].content;
    const conversationContext = normalizedMessages.slice(-2).map((m) => `${m.role}: ${m.content}`).join("\n");

    let context = "";

    try {
      const embeddingQuery = conversationContext || lastMessage;

      const { embedding } = await embed({
        model: google.textEmbeddingModel("gemini-embedding-001"),
        value: embeddingQuery,
      });

      const searchResult = await qdrant.search("aswin_portfolio_v4", {
        vector: embedding,
        limit: 3,
        with_payload: true,
      });

      context = searchResult
        .map((r) => (typeof r.payload?.text === "string" ? r.payload.text : ""))
        .filter(Boolean)
        .join("\n\n---\n\n");
    } catch (retrievalError: unknown) {
      console.error("RAG retrieval failed:", retrievalError instanceof Error ? retrievalError.message : retrievalError);
      context = "[Note: knowledge base unavailable — answer from general knowledge only]";
    }

    const systemPrompt = `You are Aswin Panengal's professional, friendly, and confident AI Assistant.

Aswin is a final-year MCA student focused on AI Engineering and Data Automation.
He has no corporate experience yet but has built strong real-world AI projects.

Context about Aswin:
${context}

---

CORE BEHAVIOR RULES:

PRIORITY ORDER:
1. Never hallucinate (use only provided context)
2. Answer the user's question directly
3. Maintain clarity and readability (Markdown)
4. Apply tone and formatting rules

---

RESPONSE RULES:

1. NO BLOCKING:
- Always answer immediately if information is available
- Do NOT delay answers with unnecessary questions

2. GREETINGS:
- If message is ONLY a greeting → reply in 1–2 short sentences
- If greeting + question → ignore greeting rule and answer directly

3. "TELL ME ABOUT ASWIN":
Provide a concise overview:
- Final-year MCA student
- Focus on AI Engineering & Automation
- Key projects (bullet points)

4. UNKNOWN INFO:
If not in context:
"I don't have that specific information in my current knowledge base, but you can reach out to Aswin directly at [Email Aswin](mailto:aswinpanengal@gmail.com)."

5. ZERO-GUESSING POLICY:
- If the user asks for a list of skills or technologies, ONLY list the exact words found in the context.
- Do NOT guess generic industry skills. If exact skills aren't in the context, say "Please check my resume for the full technical stack."

---

TONE:
- Friendly, confident, and slightly professional
- Avoid robotic or overly formal responses

---

FORMATTING (STRICT):
- Use Markdown
- Use **bold** for:
  - Projects
  - Technologies
- Use bullet points for:
  - Projects
  - Skills
  - Contact info
- Always format links properly:
  [LinkedIn](https://linkedin.com/in/aswin-panengal)
  [Email](mailto:aswinpanengal@gmail.com)

---

6. CONCISENESS & LENGTH (CRITICAL):
- Keep responses short, punchy, and highly scannable.
- MAX LENGTH: 3 short paragraphs OR a 1-sentence intro followed by 3-4 bullet points.
- NEVER output a "wall of text" or over-explain.
- If a topic is complex, provide a high-level summary and stop.

---
`;

    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      temperature: 0.1,
      system: systemPrompt,
      messages: normalizedMessages,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse({
      sendUsage: false,
      getErrorMessage: () => "An error occurred. Please try again.",
    });

  } catch (error: unknown) {
    console.error("Chat route error:", error instanceof Error ? error.message : error);
    return new Response("An error occurred. Please try again.", { status: 500 });
  }
}
