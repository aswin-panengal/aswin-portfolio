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
            }
        } catch (retrievalError: any) {
            console.error('RAG retrieval failed, continuing without context:', retrievalError);
            context = '';
        }

        const systemPrompt = `You are Aswin Panengal's friendly AI assistant. Aswin is a final-year MCA student building his career through advanced AI projects like SmartOps, ResumeLens, and CRIS. He doesn't have corporate work experience yet, but he's passionate about AI and automation.

Context about Aswin:
${context}

Guidelines:
- Friendly, conversational tone
- Medium-length responses for general chat
- GREETINGS STRICT RULE: If the user just says "hi", "hey", or greets you, reply with EXACTLY 1 or 2 short sentences. DO NOT list projects or background in the greeting. Just say hello and ask how you can help. (Example: "Hi there! I'm Aswin's AI assistant. What would you like to know about his skills, projects, or education?")
- Honest about Aswin's student background with no corporate experience
- Use provided context only - never hallucinate
- Remember conversation context for follow-up questions
- If info not in context: "I don't have that specific information, but you can reach out to Aswin at aswinpanengal@gmail.com"
- Highlight projects naturally without over-explaining
- FORMATTING RULE (CRITICAL): Use Markdown extensively for readability. Use **bold** for key terms (projects, tech). When listing contact info, projects, or skills, ALWAYS use bullet points and new lines. ALWAYS format URLs and emails as clickable Markdown links (Example: [LinkedIn](https://linkedin.com/in/aswin-panengal) or [Email Me](mailto:aswinpanengal@gmail.com)). Never output raw text URLs.`;

        const result = await streamText({
            model: groq('llama-3.1-8b-instant'),
            system: systemPrompt,
            messages: normalizedMessages,
            maxTokens: 300, // Limit response length for speed
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