"""
rag_pipeline.py
Core retrieval-augmented generation pipeline for the BIS assistant.

Flow:
  user query -> embed -> retrieve top-k chunks -> build grounded prompt
  -> call LLM -> return answer + structured citations

Run interactively:  python rag_pipeline.py
"""

import os
from functools import lru_cache
from typing import cast

import chromadb
from chromadb.api.types import Embeddable, EmbeddingFunction
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

load_dotenv()

DB_DIR = "./chroma_db"
COLLECTION_NAME = "bis_knowledge_base"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
# Two focused chunks keep the prompt small and make interactive replies faster.
TOP_K = 2

# ---------------------------------------------------------------------------
# Retrieval
# ---------------------------------------------------------------------------

class Retriever:
    def __init__(self):
        client = chromadb.PersistentClient(path=DB_DIR)
        embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=EMBEDDING_MODEL
        )
        self.collection = client.get_collection(
            name=COLLECTION_NAME,
            # Chroma's type definitions declare this parameter for all
            # Embeddable inputs, while this implementation intentionally
            # embeds text Documents only.
            embedding_function=cast(EmbeddingFunction[Embeddable], embed_fn),
        )

    def retrieve(self, query: str, top_k: int = TOP_K):
        results = self.collection.query(query_texts=[query], n_results=top_k)

        # ChromaDB marks these response fields as optional in its type hints.
        # A successful text query needs all four fields to build a chunk.
        ids = results["ids"]
        documents = results["documents"]
        metadatas = results["metadatas"]
        distances = results["distances"]
        if not ids or not documents or not metadatas or not distances:
            return []

        chunks = []
        for i in range(len(ids[0])):
            chunks.append({
                "text": documents[0][i],
                "metadata": metadatas[0][i],
                "distance": distances[0][i],  # lower = more similar
            })
        return chunks


# ---------------------------------------------------------------------------
# Prompt construction
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are the BIS (Bureau of Indian Standards) Assistant, helping MSMEs, \
startups, students, and consumers understand Indian Standards, certification schemes, \
hallmarking, and testing requirements.

Rules you MUST follow:
1. Answer ONLY using the information in the provided context chunks. Do not use outside knowledge.
2. If the context does not contain enough information to answer, say so clearly and suggest \
   the user consult the official BIS portal (bis.gov.in) or a BIS branch office. Do NOT guess.
3. Every factual claim must be traceable to a specific source. After each claim, cite the \
   standard number or scheme name in square brackets, e.g. [IS 302 (Part 1)] or [BIS Hallmarking Scheme].
4. Mention the "last revised" year of a standard when relevant, so the user knows if it may be outdated.
5. Keep answers practical and concise: use at most 5 short bullets and stay under 180 words.
6. Never fabricate a standard number, clause, or scheme that isn't in the provided context.
"""


def build_prompt(query: str, chunks: list) -> str:
    context_blocks = []
    for c in chunks:
        m = c["metadata"]
        context_blocks.append(
            f"[Source: {m['standard_no']} - {m['title']} | Scheme: {m['scheme']} "
            f"| Last revised: {m['last_revised']}]\n{c['text']}"
        )
    context_str = "\n\n---\n\n".join(context_blocks)

    return f"""Context (retrieved from BIS knowledge base):

{context_str}

---

User question: {query}

Answer the question using only the context above, with inline citations."""


# ---------------------------------------------------------------------------
# Generation (pluggable LLM backend)
# ---------------------------------------------------------------------------

def generate_answer_anthropic(prompt: str) -> str:
    import anthropic
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    # Anthropic responses can include non-text blocks (for example, thinking
    # blocks), which do not have a ``text`` attribute.
    return "\n".join(
        text
        for block in response.content
        if isinstance((text := getattr(block, "text", None)), str)
    )


def generate_answer_openai(prompt: str) -> str:
    from openai import OpenAI
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=1000,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content or ""


@lru_cache(maxsize=1)
def get_gemini_model():
    import google.generativeai as genai
    # ``configure`` is available in google-generativeai 0.8.x, although its
    # type metadata does not list it as a public module export.
    getattr(genai, "configure")(api_key=os.environ["GEMINI_API_KEY"])
    return getattr(genai, "GenerativeModel")(
        model_name="gemini-3-flash-preview",  # swap to "gemini-1.5-pro" for higher quality
        system_instruction=SYSTEM_PROMPT,
    )


def generate_answer_gemini(prompt: str, on_token=None) -> str:
    model = get_gemini_model()
    generation_config = {"max_output_tokens": 250}
    if on_token is None:
        response = model.generate_content(
            prompt,
            generation_config=generation_config,
        )
        return response.text

    response = model.generate_content(
        prompt,
        generation_config=generation_config,
        stream=True,
    )
    parts = []
    for chunk in response:
        chunk_text = getattr(chunk, "text", "")
        if chunk_text:
            parts.append(chunk_text)
            on_token(chunk_text)
    return "".join(parts)


LLM_BACKENDS = {
    "anthropic": generate_answer_anthropic,
    "openai": generate_answer_openai,
    "gemini": generate_answer_gemini,
}


# ---------------------------------------------------------------------------
# Full pipeline
# ---------------------------------------------------------------------------

class BISRagPipeline:
    def __init__(self, backend: str = "anthropic"):
        self.retriever = Retriever()
        if backend not in LLM_BACKENDS:
            raise ValueError(f"Unknown backend '{backend}'. Choose from {list(LLM_BACKENDS)}")
        self.backend = backend
        self.generate_fn = LLM_BACKENDS[backend]

    def answer(self, query: str, top_k: int = TOP_K, min_relevance: float = 0.8, on_token=None):
        chunks = self.retriever.retrieve(query, top_k=top_k)

        # Guardrail: if nothing is relevant enough, don't force the LLM to answer
        relevant_chunks = [c for c in chunks if c["distance"] <= min_relevance]
        if not relevant_chunks:
            return {
                "answer": (
                    "I couldn't find this in the BIS knowledge base I have access to. "
                    "Please check bis.gov.in or contact your nearest BIS branch office directly."
                ),
                "sources": [],
                "raw_chunks": chunks,
            }

        prompt = build_prompt(query, relevant_chunks)
        if self.backend == "gemini" and on_token is not None:
            answer_text = generate_answer_gemini(prompt, on_token=on_token)
        else:
            answer_text = self.generate_fn(prompt)

        sources = []
        seen = set()
        for c in relevant_chunks:
            key = c["metadata"]["standard_no"]
            if key not in seen:
                seen.add(key)
                sources.append({
                    "standard_no": c["metadata"]["standard_no"],
                    "title": c["metadata"]["title"],
                    "scheme": c["metadata"]["scheme"],
                    "last_revised": c["metadata"]["last_revised"],
                })

        return {"answer": answer_text, "sources": sources, "raw_chunks": relevant_chunks}


# ---------------------------------------------------------------------------
# CLI for quick manual testing
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Honour an explicit choice first.  Otherwise select the backend for the
    # API key that is actually configured, rather than always trying Anthropic.
    backend = os.environ.get("LLM_BACKEND")
    if not backend:
        backend = next(
            (
                name
                for name, env_var in (
                    ("anthropic", "ANTHROPIC_API_KEY"),
                    ("openai", "OPENAI_API_KEY"),
                    ("gemini", "GEMINI_API_KEY"),
                )
                if os.environ.get(env_var)
            ),
            "anthropic",
        )
    pipeline = BISRagPipeline(backend=backend)

    print(f"BIS RAG Assistant (backend={backend}). Type 'exit' to quit.\n")
    while True:
        query = input("You: ").strip()
        if query.lower() in ("exit", "quit"):
            break
        print("\nAssistant: ", end="", flush=True)
        result = pipeline.answer(
            query,
            on_token=lambda text: print(text, end="", flush=True),
        )
        if not result["sources"]:
            print(result["answer"], end="")
        print("\n")
        print("Sources:", ", ".join(s["standard_no"] for s in result["sources"]))
        print("-" * 60)
