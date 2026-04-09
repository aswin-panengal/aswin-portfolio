import os
import uuid
from google import genai
from google.genai import types
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from dotenv import load_dotenv

# Load keys from the root .env.local
load_dotenv(".env.local")

# 1. NEW SDK SETUP
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"), 
    api_key=os.getenv("QDRANT_API_KEY")
)

# We use v4 to ensure a clean slate for the new model
COLLECTION_NAME = "aswin_portfolio_v4"

def ingest():
    print("Reading your knowledge base...")
    with open("aswin_knowledge_base.md", "r", encoding="utf-8") as f:
        content = f.read()
    
    chunks = [("SECTION " + c.strip()) for c in content.split("SECTION") if len(c.strip()) > 50]
    
    if not qdrant_client.collection_exists(COLLECTION_NAME):
        print(f"Creating cloud collection: {COLLECTION_NAME}")
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            # The new model outputs vectors in 3072 dimensions
            vectors_config=VectorParams(size=3072, distance=Distance.COSINE),
        )

    print(f"Generating embeddings for {len(chunks)} chunks and uploading...")
    points = []
    for chunk in chunks:
        # 2. UPDATED MODEL NAME AND CONFIG
        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=chunk
        )
        
        vector = response.embeddings[0].values

        points.append(PointStruct(
            id=str(uuid.uuid4()),
            vector=vector,
            payload={"text": chunk}
        ))
    
    qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)
    print(" DATA IS LIVE! Your cloud database is ready.")

if __name__ == "__main__":
    ingest()