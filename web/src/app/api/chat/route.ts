import { streamText, embed } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { QdrantClient } from "@qdrant/js-client-rest";

// Initialize Google AI provider
const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || '',
});

// Initialize Qdrant Client
const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1].content;

        //
        const { embedding } = await embed({
            model: google.textEmbeddingModel('gemini-embedding-001'),
            value: lastMessage,
        });

        // 2. Search Qdrant using the 768-dimension vector
        const searchResult = await qdrant.search("aswin_portfolio_v4", {
            vector: embedding,
            limit: 3,
            with_payload: true,
        });

        // Combine the retrieved data into a single string
        const context = searchResult.map(r => r.payload?.text).join("\n\n---\n\n");

        // 3. Create the System Prompt
        const systemPrompt = `You are a friendly, professional AI assistant for Aswin Panengal, an aspiring Data Analyst and AI Engineer.
        Your goal is to represent Aswin positively and answer every question using ONLY the provided context from the database.

        Context about Aswin:
        ${context}

        Rules for replying:
        1. Always answer using the context provided above and never invent information.
        2. If the answer is available in the context, respond in a warm, helpful tone as if you are Aswin's assistant.
        3. If the answer is not in the context, say: "I don't have that information in my current knowledge base, but you can reach out to Aswin directly at aswinpanengal@gmail.com." 
        4. Keep responses friendly, concise, and easy to understand.
        5. If the user greets you, reply warmly and offer help with his skills, projects, or experience.`;
        // 4. Generate the Stream
        const result = await streamText({
            model: google('gemini-3-flash-preview'),
            system: systemPrompt,
            messages: messages,
        });

        // 5. Return the text stream (Perfect for your custom frontend fetch loop)
        return result.toTextStreamResponse();

    } catch (error: any) {
        // Detailed error logging for future debugging
        console.error("CRITICAL BACKEND ERROR:", error);
        return new Response(error.message || "Unknown backend error occurred", { status: 500 });
    }
}