"""
ingest.py
Loads BIS knowledge-base documents, chunks them, embeds them,
and stores them in a persistent local ChromaDB collection.

Run:  python ingest.py
"""

import json
from typing import cast

import chromadb
from chromadb.api.types import Embeddable, EmbeddingFunction
from chromadb.utils import embedding_functions
from langchain_text_splitters import RecursiveCharacterTextSplitter

DATA_FILE = "sample_data.json"
DB_DIR = "./chroma_db"
COLLECTION_NAME = "bis_knowledge_base"

# Free, local embedding model - no API key needed.
# Swap for a stronger model later (e.g. "BAAI/bge-large-en-v1.5") if quality needs improving.
EMBEDDING_MODEL = "all-MiniLM-L6-v2"


def load_documents(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def chunk_documents(docs):
    """
    Splits each document's content into overlapping chunks so retrieval
    can pull the specific relevant passage instead of a whole long document.
    Metadata (standard_no, scheme, etc.) is carried onto every chunk so
    citations survive chunking.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=80,
        separators=["\n\n", "\n", ". ", " "],
    )

    chunk_texts, chunk_ids, chunk_metadatas = [], [], []

    for doc in docs:
        splits = splitter.split_text(doc["content"])
        for i, chunk in enumerate(splits):
            chunk_texts.append(chunk)
            chunk_ids.append(f"{doc['id']}_chunk{i}")
            chunk_metadatas.append({
                "doc_id": doc["id"],
                "standard_no": doc["standard_no"],
                "title": doc["title"],
                "scheme": doc["scheme"],
                "category": doc["category"],
                "last_revised": doc["last_revised"],
            })

    return chunk_texts, chunk_ids, chunk_metadatas


def build_vector_store():
    docs = load_documents(DATA_FILE)
    texts, ids, metadatas = chunk_documents(docs)

    client = chromadb.PersistentClient(path=DB_DIR)

    # Delete existing collection if re-running ingestion (keeps this idempotent)
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )

    collection = client.create_collection(
        name=COLLECTION_NAME,
        # This embedder accepts text Documents; Chroma's stub requests the
        # wider Embeddable type, so cast at the API boundary.
        embedding_function=cast(EmbeddingFunction[Embeddable], embed_fn),
        metadata={"hnsw:space": "cosine"},
    )

    collection.add(documents=texts, ids=ids, metadatas=metadatas)

    print(f"Ingested {len(docs)} source documents -> {len(texts)} chunks into '{COLLECTION_NAME}'.")
    return collection


if __name__ == "__main__":
    build_vector_store()
