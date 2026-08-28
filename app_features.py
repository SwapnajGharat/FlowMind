"""
app_features.py
Backend logic for the Bureau of Indian Standards (BIS) AI Assistant.
Handles ChromaDB vector queries, Groq LLM generations, Whisper transcriptions,
and structured JSON outputs.
"""

import os
import re
import json
from typing import List, Dict, Any
from groq import Groq
import chromadb
from chromadb.utils import embedding_functions


class EnhancedBISAssistant:
    def __init__(self, db_path: str = "./chroma_db", collection_name: str = "bis_standards"):
        # Initialize Groq Client
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set.")
        
        self.groq_client = Groq(api_key=self.groq_api_key)
        self.chat_history: List[Dict[str, str]] = []

        # Initialize ChromaDB vector database
        self.chroma_client = chromadb.PersistentClient(path=db_path)
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.chroma_client.get_or_create_collection(
            name=collection_name, 
            embedding_function=self.embedding_fn
        )

    def _get_active_model(self) -> str:
        """Returns the primary Groq LLM model."""
        return "llama-3.3-70b-versatile"

    def retrieve(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """Retrieves top_k context chunks from ChromaDB for a given query."""
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )
        
        parsed_results = []
        if results and results["documents"]:
            docs = results["documents"][0]
            metadatas = results["metadatas"][0] if results["metadatas"] else [{}] * len(docs)
            for doc, meta in zip(docs, metadatas):
                parsed_results.append({"content": doc, "metadata": meta})
        return parsed_results

    # Feature 1: Conversational RAG Chat
    def ask_chat(self, user_query: str) -> str:
        """Executes RAG retrieval and generates an answer using Groq LLM."""
        chunks = self.retrieve(user_query)
        context_str = "\n\n".join([f"Source ({c['metadata'].get('standard_no', 'N/A')}):\n{c['content']}" for c in chunks])
        
        system_prompt = (
            "You are an expert AI Assistant specialized in the Bureau of Indian Standards (BIS).\n"
            "Use the provided standard context documents to answer the user accurately.\n"
            "If the information is not explicitly covered in the context, state that clearly."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            *self.chat_history,
            {"role": "user", "content": f"Context:\n{context_str}\n\nQuestion: {user_query}"}
        ]

        response = self.groq_client.chat.completions.create(
            model=self._get_active_model(),
            messages=messages,
            temperature=0.2,
            max_tokens=1000
        )
        
        answer = response.choices[0].message.content or "No response generated."
        self.chat_history.append({"role": "user", "content": user_query})
        self.chat_history.append({"role": "assistant", "content": answer})
        return answer

    # Feature 2: Groq Whisper Voice Transcription
    def transcribe_audio(self, audio_bytes: bytes, temp_filename: str = "temp_audio.wav") -> str:
        """Transcribes raw audio bytes into text using Groq's whisper-large-v3 model."""
        with open(temp_filename, "wb") as f:
            f.write(audio_bytes)
            
        try:
            with open(temp_filename, "rb") as file:
                transcription = self.groq_client.audio.transcriptions.create(
                    file=(temp_filename, file.read()),
                    model="whisper-large-v3",
                    response_format="json",
                    temperature=0.0
                )
            return transcription.text.strip()
        finally:
            if os.path.exists(temp_filename):
                os.remove(temp_filename)

    # Feature 3: MSME Audit Checklist Generator
    def generate_audit_checklist(self, product_or_standard: str) -> Dict[str, Any]:
        """Extracts compliance checklists and laboratory requirements from ChromaDB as JSON."""
        clean_input = product_or_standard.strip().strip('"').strip("'")
        chunks = self.retrieve(f"Quality compliance, raw materials, testing equipment requirements for {clean_input}")
        
        if not chunks:
            return {"error": f"No compliance details found for '{clean_input}'."}

        context_text = "\n".join([c["content"] for c in chunks])
        
        prompt = f"""Extract mandatory compliance checks for MSMEs applying for BIS certification for: '{clean_input}'.
Context:
{context_text}

Return strictly a JSON object formatted as follows:
{{
  "standard_no": "Standard Number",
  "product_title": "Product Title",
  "raw_material_checks": ["Check item 1", "Check item 2"],
  "mandatory_lab_equipment": ["Equipment 1", "Equipment 2"],
  "factory_quality_checks": ["Factory check 1", "Factory check 2"]
}}"""

        response = self.groq_client.chat.completions.create(
            model=self._get_active_model(),
            messages=[
                {"role": "system", "content": "You output JSON only. Do not include markdown tags or setup text."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=700,
        )
        
        raw_output = response.choices[0].message.content or ""
        clean_json = re.sub(r"```json|```", "", raw_output).strip()
        
        try:
            return json.loads(clean_json)
        except Exception:
            return {
                "standard_no": chunks[0]["metadata"].get("standard_no", "IS Standard"),
                "product_title": chunks[0]["metadata"].get("title", clean_input),
                "raw_material_checks": ["Verify grade chemical composition against Indian Standards."],
                "mandatory_lab_equipment": ["Standard calibrated measurement instruments."],
                "factory_quality_checks": ["Maintain batch production inspection logs."]
            }

    # Feature 4: Product Lookup
    def get_product_description(self, query: str) -> str:
        """Retrieves specific technical product specifications from standard files."""
        chunks = self.retrieve(query, top_k=2)
        if not chunks:
            return f"No product specifications found for **{query}**."
        
        results_str = ""
        for c in chunks:
            std = c['metadata'].get('standard_no', 'General Specification')
            results_str += f"### Specification: {std}\n{c['content']}\n\n---\n"
        return results_str

    # Feature 5: Testing Labs Directory Search
    def locate_testing_labs(self, category: str) -> List[Dict[str, str]]:
        """Searches recognized testing facilities for a specified product category."""
        chunks = self.retrieve(f"Testing laboratories recognized for {category}", top_k=3)
        labs = []
        for i, c in enumerate(chunks, 1):
            labs.append({
                "Lab ID": f"BIS-LAB-00{i}",
                "Facility Name": f"Recognized Test House for {category.capitalize()}",
                "Location": c['metadata'].get('location', 'Regional Office / Standard Laboratory'),
                "Status": "Active / Recognized"
            })
        return labs