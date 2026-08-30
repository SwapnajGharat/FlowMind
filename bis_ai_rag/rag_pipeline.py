"""
rag_pipeline.py
Handles localized vector retrieval via ChromaDB and query execution via the Groq API.
Synthesizes and formats user-centric answers in a single pipeline execution.
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Any, cast
import chromadb
from chromadb.api.types import Embeddable, EmbeddingFunction
from chromadb.utils import embedding_functions
from dotenv import load_dotenv
from groq import Groq

# Prevent OpenBLAS memory allocation failures and multi-threading conflicts
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

# Silence environment warnings on load
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

DB_DIR = BASE_DIR / "chroma_db"
COLLECTION_NAME = "bis_knowledge_base"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

SYSTEM_PROMPT = """You are an expert technical assistant for the Bureau of Indian Standards (BIS). 
Answer user queries accurately using ONLY the provided context excerpts below. 
Always cite the relevant standard numbers and titles in your response. 
If the answer cannot be found in the context, state clearly that the information is unavailable.

Format your output strictly using these sections:
1. **Summary**: A 1-2 sentence high-level overview in simple, everyday language.
2. **Key Technical Standards**: Highlight standard numbers and titles in bold.
3. **Core Requirements & Scope**: Use scannable bullet points for testing, compliance, or scope details.
4. **Actionable Takeaway**: A short closing note for end-users or manufacturers."""


class BISPipeline:
    def __init__(self, top_k: int = 3):
        self.top_k = top_k
        self.client = chromadb.PersistentClient(path=str(DB_DIR))
        
        embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=EMBEDDING_MODEL
        )
        
        self.collection = self.client.get_collection(
            name=COLLECTION_NAME,
            embedding_function=cast(EmbeddingFunction[Embeddable], embed_fn),
        )
        
        groq_api_key = os.environ.get("GROQ_API_KEY")
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable is missing or not set.")
        self.groq_client = Groq(api_key=groq_api_key)

    def retrieve(self, query: str) -> List[Dict[str, Any]]:
        results = self.collection.query(
            query_texts=[query],
            n_results=self.top_k
        )
        
        formatted_chunks: List[Dict[str, Any]] = []
        if not results:
            return formatted_chunks

        document_groups = results.get("documents")
        metadata_groups = results.get("metadatas")
        if not document_groups or document_groups[0] is None:
            return formatted_chunks

        documents = document_groups[0]
        metadatas = metadata_groups[0] if metadata_groups and metadata_groups[0] else []
        
        for doc, meta in zip(documents, metadatas):
            if doc is None:
                continue
            formatted_chunks.append({
                "content": doc,
                "metadata": meta or {}
            })
            
        return formatted_chunks

    def _get_active_model(self) -> str:
        # Filter out guard, whisper, vision, and high-TPM preview models
        available_models = [
            m.id for m in self.groq_client.models.list().data 
            if not any(x in m.id.lower() for x in ["guard", "whisper", "orpheus", "vision", "tool", "gpt-oss"])
        ]
        
        preferred_models = [
            "llama-3.1-8b-instant",
            "llama3-8b-8192",
            "llama-3.3-70b-versatile",
            "mixtral-8x7b-32768"
        ]
        
        return next((m for m in preferred_models if m in available_models), available_models[0])

    def generate_answer(self, query: str) -> str:
        chunks = self.retrieve(query)
        
        context_block = ""
        for idx, item in enumerate(chunks):
            meta = item["metadata"]
            context_block += f"\n--- Source [{idx+1}] ---"
            context_block += f"\nStandard: {meta.get('standard_no')} - {meta.get('title')}"
            context_block += f"\nScheme: {meta.get('scheme')} | Category: {meta.get('category')}"
            context_block += f"\nContent: {item['content']}\n"

        prompt = f"Context:\n{context_block}\n\nUser Query: {query}\n\nAnswer:"
        selected_model = self._get_active_model()

        response = self.groq_client.chat.completions.create(
            model=selected_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=600,
        )
        
        raw_content = response.choices[0].message.content or ""
        # Strip reasoning tags (<think>...</think>) if present
        clean_content = re.sub(r"<think>.*?</think>", "", raw_content, flags=re.DOTALL).strip()
        return clean_content


if __name__ == "__main__":
    pipeline = BISPipeline()
    print("\n=======================================================")
    print("  BIS Knowledge Base RAG Assistant (Single-Pass Mode)")
    print("=======================================================\n")
    
    while True:
        try:
            user_query = input("\nEnter your query: ").strip()
            if user_query.lower() in ["exit", "quit", "q"]:
                print("Exiting RAG assistant.")
                break
            if not user_query:
                continue
                
            print("\nSearching database, synthesizing, and formatting response...")
            answer = pipeline.generate_answer(user_query)
            print("\n" + "="*55)
            print(answer)
            print("="*55)
        except (KeyboardInterrupt, EOFError):
            print("\nExiting RAG assistant.")
            break
