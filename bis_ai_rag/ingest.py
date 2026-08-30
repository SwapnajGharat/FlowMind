"""
ingest.py
Loads BIS JSON data, splits text using recursive character splitting, 
generates deterministic unique IDs to prevent collisions, and builds a persistent ChromaDB vector store.
"""

import json
import os
from pathlib import Path
from typing import cast
import chromadb
from chromadb.api.types import Embeddable, EmbeddingFunction
from chromadb.utils import embedding_functions
from langchain_text_splitters import RecursiveCharacterTextSplitter

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "sample_data.json"
DB_DIR = BASE_DIR / "chroma_db"
COLLECTION_NAME = "bis_knowledge_base"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"


def load_documents(path: str):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Source file {path} not found at {path}.")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def chunk_documents(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=80,
        separators=["\n\n", "\n", ". ", " "],
    )

    chunk_texts, chunk_ids, chunk_metadatas = [], [], []

    for idx, doc in enumerate(docs):
        base_id = doc.get("id", f"doc_{idx}")
        content = doc.get("content", "")
        splits = splitter.split_text(content)
        
        for i, chunk in enumerate(splits):
            chunk_texts.append(chunk)
            # Strict deterministic unique ID format to avoid ChromaDB collision errors
            chunk_ids.append(f"{base_id}_chunk_{idx}_{i}")
            chunk_metadatas.append({
                "doc_id": base_id,
                "standard_no": doc.get("standard_no", "Unknown"),
                "title": doc.get("title", "Untitled"),
                "scheme": doc.get("scheme", "General"),
                "category": doc.get("category", "General"),
                "last_revised": doc.get("last_revised", "N/A"),
            })

    return chunk_texts, chunk_ids, chunk_metadatas


def build_vector_store():
    docs = load_documents(DATA_FILE)
    texts, ids, metadatas = chunk_documents(docs)

    client = chromadb.PersistentClient(path=str(DB_DIR))

    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )

    collection = client.create_collection(
        name=COLLECTION_NAME,
        embedding_function=cast(EmbeddingFunction[Embeddable], embed_fn),
        metadata={"hnsw:space": "cosine"},
    )

    collection.add(documents=texts, ids=ids, metadatas=metadatas)
    print(f"Successfully processed {len(docs)} documents into {len(texts)} chunks inside ChromaDB.")
    return collection


if __name__ == "__main__":
    build_vector_store()
