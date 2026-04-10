# Aswin's AI-Powered Portfolio

A personal portfolio website featuring a custom RAG (Retrieval-Augmented Generation) AI assistant. Built to showcase my projects, skills, and experience, this site allows recruiters and visitors to interact directly with an AI trained on my resume and technical background.

Live Site: [aswinpanengal.me](https://www.aswinpanengal.me)

## Features

* **Interactive AI Chatbot:** Powered by Google's Gemini 3 Flash model, capable of answering context-aware questions about my education, projects, and skills.
* **Retrieval-Augmented Generation (RAG):** Uses a Qdrant vector database to store and retrieve semantic embeddings of my personal knowledge base, ensuring the AI gives highly accurate, hallucination-free answers.
* **Serverless Edge Architecture:** Deployed on Vercel with function regions optimized for ultra-low latency between the API routes and the vector database.
* **Responsive UI:** Built with Next.js and modern web standards for a seamless experience across all devices.

##  Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **AI Model:** Google Gemini API (`gemini-3-flash-preview` & `gemini-embedding-001`)
* **Vector Database:** [Qdrant](https://qdrant.tech/) Cloud
* **Deployment:** [Vercel](https://vercel.com/)
* **Data Pipeline:** Python (for document parsing and embedding ingestion)

##  Local Setup

To run this project locally on your machine:

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/aswin-panengal/aswin-portfolio.git
cd aswin-portfolio/web
\`\`\`

**2. Install dependencies**
\`\`\`bash
npm install
\`\`\`

**3. Set up Environment Variables**
Create a `.env.local` file in the `web` directory and add your API keys:
\`\`\`env
GEMINI_API_KEY=your_google_gemini_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
\`\`\`

**4. Run the development server**
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##  Knowledge Base Ingestion

To update the AI's knowledge:
1. Edit the `knowledge.md` file in the root directory.
2. Run the Python ingestion script to chunk, embed, and push the new data to Qdrant:
\`\`\`bash
python ingest.py
\`\`\`

##  Contact

If you are a recruiter or developer looking to connect, feel free to chat with the AI on my site or reach out via [LinkedIn](#).