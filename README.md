# Aswin's Portfolio

Portfolio website with an AI assistant grounded in a personal knowledge base.

Live site: [aswinpanengal.me](https://www.aswinpanengal.me)

## Stack

- Next.js App Router, React, TypeScript, and Tailwind CSS
- Framer Motion for animation
- Groq (`openai/gpt-oss-20b`) for chat
- Gemini (`gemini-embedding-001`) for embeddings
- Qdrant Cloud for vector retrieval
- Python for knowledge-base ingestion

## Run locally

From the repository root:

```powershell
Copy-Item .env.example web/.env.local
cd web
npm ci
npm run dev
```

Fill in `web/.env.local` before starting the app:

```dotenv
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
QDRANT_URL=your_cluster_endpoint
QDRANT_API_KEY=your_database_key
QDRANT_COLLECTION_NAME=aswin_portfolio_v4
```

Open [localhost:3000](http://localhost:3000).

## Update the knowledge base

The private source file is `aswin_knowledge_base.md` in the repository root. It is excluded from Git along with local credentials.

From the repository root:

```powershell
python -m venv .env_aswin
./.env_aswin/Scripts/python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env.local
```

Fill in the root `.env.local` with the ingestion credentials and the same collection name as the web app. Ingestion needs write access and permission to create the collection on its first run.

Edit the knowledge base, preview its sections, and upload:

```powershell
./.env_aswin/Scripts/python.exe ingest.py --dry-run
./.env_aswin/Scripts/python.exe ingest.py
```

Ingestion backs up existing cloud points locally, uses stable section IDs, and verifies uploads. On Windows, backups are stored under `%LOCALAPPDATA%/aswin-portfolio/backups`.

The chatbot's project lookups reference the stable IDs of sections 4–6. Keep those section numbers assigned to SmartOps, ResumeLens, and CRIS.

## Build and deploy

```powershell
cd web
npm run lint
npm run build
```

Set the Vercel project root to `web` and configure the same environment variables in Vercel before deployment. Local `.env.local` files are not uploaded to Git.

The Qdrant cluster can also host SmartOps in its separate `smartops_documents_v2` collection. The portfolio uses `aswin_portfolio_v4`.

## Contact

[Email](mailto:aswinpanengal@gmail.com) · [LinkedIn](https://www.linkedin.com/in/aswinpanengal/) · [Instagram](https://www.instagram.com/aswinpanengal/)
