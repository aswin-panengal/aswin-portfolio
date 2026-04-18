import { streamText, embed } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { QdrantClient } from "@qdrant/js-client-rest";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || '',
});

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY || '',
});

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || '',
    apiKey: process.env.QDRANT_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const normalizedMessages = Array.isArray(messages)
            ? messages.map((message: any) => ({
                role: message.role,
                content:
                    typeof message.content === 'string'
                        ? message.content
                        : message.content?.text || JSON.stringify(message.content || ''),
            }))
            : [];

        const lastMessage = normalizedMessages.length > 0 ? normalizedMessages[normalizedMessages.length - 1].content : '';

        // Include recent conversation context for better follow-up questions
        const recentMessages = normalizedMessages.slice(-2); // Reduced to 2 messages for speed
        const conversationContext = recentMessages.map(m => `${m.role}: ${m.content}`).join('\n');

        let context = '';

        try {
            if (lastMessage && process.env.GEMINI_API_KEY && process.env.QDRANT_URL && process.env.QDRANT_API_KEY) {
                // Use conversation context for embedding to handle follow-up questions
                const embeddingQuery = conversationContext || lastMessage;

                const { embedding } = await embed({
                    model: google.textEmbeddingModel('gemini-embedding-001'),
                    value: embeddingQuery,
                });

                const searchResult = await qdrant.search('aswin_portfolio_v4', {
                    vector: embedding,
                    limit: 3, // Reduced for speed
                    with_payload: true,
                });

                context = searchResult
                    .map((r) => (typeof r.payload?.text === 'string' ? r.payload.text : ''))
                    .filter(Boolean)
                    .join('\n\n---\n\n');

                // Debugger to verify Qdrant is actually returning your skills
                console.log("\n--- QDRANT CONTEXT ---\n", context, "\n----------------------\n");
            }
        } catch (retrievalError: any) {
            console.error('RAG retrieval failed, continuing without context:', retrievalError);
            context = '';
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

3. “TELL ME ABOUT ASWIN”:
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

        const result = await streamText({
            model: groq('llama-3.1-8b-instant'),
            temperature: 0.1, // Added to enforce strict factual adherence
            system: systemPrompt,
            messages: normalizedMessages,
            maxTokens: 1000, // Limit response length for speed
        });

        return result.toDataStreamResponse({
            sendUsage: false,
            getErrorMessage: (error) => (error instanceof Error ? error.message : String(error)),
        });

    } catch (error: any) {
        // Detailed error logging for future debugging
        console.error("CRITICAL BACKEND ERROR:", error);
        return new Response(error.message || "Unknown backend error occurred", { status: 500 });
    }
}