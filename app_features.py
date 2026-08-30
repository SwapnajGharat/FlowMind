"""
app_features.py
Backend logic for the Bureau of Indian Standards (BIS) AI Assistant using Google AI Studio (Gemini).
"""

import os
import re
import json
from typing import List, Dict, Any
import google.generativeai as genai
import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

load_dotenv()


class EnhancedBISAssistant:
    def __init__(self, db_path: str = "./chroma_db", collection_name: str = "bis_knowledge_base", api_key: str = None):
        # Resolve API Key securely from argument or environment variable
        self.api_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY or GOOGLE_API_KEY environment variable is missing.")
        
        # Configure Google Generative AI
        genai.configure(api_key=self.api_key)
        self.chat_history: List[Dict[str, str]] = []

        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )

        self.chroma_client = chromadb.PersistentClient(path=db_path)
        self.collection = self.chroma_client.get_or_create_collection(
            name=collection_name, 
            embedding_function=self.embedding_fn
        )

    def _get_active_model(self) -> str:
        """Returns the official Google Gemini model endpoint."""
        return "gemini-2.5-flash"

    def retrieve(self, query: str, top_k: int = 6) -> List[Dict[str, Any]]:
        """Queries ChromaDB vector collection and returns deduplicated context chunks."""
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )
        
        parsed_results = []
        if results and results.get("documents"):
            docs = results["documents"][0]
            metadatas = results["metadatas"][0] if results.get("metadatas") else [{}] * len(docs)
            
            seen_contents = set()
            for doc, meta in zip(docs, metadatas):
                if doc not in seen_contents:
                    seen_contents.add(doc)
                    parsed_results.append({"content": doc, "metadata": meta})
                    
        return parsed_results

    # -------------------------------------------------------------------------
    # Feature 1: Conversational RAG Chat
    # -------------------------------------------------------------------------
    def ask_chat(self, user_query: str) -> str:
        chunks = self.retrieve(user_query, top_k=6)
        
        if chunks:
            context_str = "\n\n".join([
                f"Source Standard ({c['metadata'].get('standard_no', 'N/A')}):\n{c['content']}" 
                for c in chunks
            ])
        else:
            context_str = "No specific match found in the local knowledge base."

        system_prompt = (
            "You are an expert AI Assistant specialized in the Bureau of Indian Standards (BIS).\n"
            "Use the provided standard context documents to answer the user accurately.\n"
            "Provide clear, actionable details based on the standards provided."
        )

        prompt = f"{system_prompt}\n\nContext:\n{context_str}\n\nQuestion: {user_query}"

        try:
            model = genai.GenerativeModel(self._get_active_model())
            response = model.generate_content(prompt)
            
            answer = response.text.strip() if response.text else "I searched the knowledge base, but could not generate a response."

        except Exception as e:
            answer = f"Error communicating with Gemini API: {str(e)}"

        self.chat_history.append({"role": "user", "content": user_query})
        self.chat_history.append({"role": "assistant", "content": answer})
        return answer

    # -------------------------------------------------------------------------
    # Feature 2: Voice Input Transcription
    # -------------------------------------------------------------------------
    def transcribe_audio(self, audio_bytes: bytes, temp_filename: str = "temp_audio.wav") -> str:
        with open(temp_filename, "wb") as f:
            f.write(audio_bytes)
            
        try:
            audio_file = genai.upload_file(path=temp_filename)
            model = genai.GenerativeModel(self._get_active_model())
            response = model.generate_content(["Please transcribe this audio accurately into text:", audio_file])
            return response.text.strip()
        except Exception as e:
            return f"Audio transcription failed: {str(e)}"
        finally:
            if os.path.exists(temp_filename):
                os.remove(temp_filename)

    # -------------------------------------------------------------------------
    # Feature 3: MSME Compliance Readiness Calculator & Audit Checklist
    # -------------------------------------------------------------------------
    def generate_audit_checklist(self, product_or_standard: str) -> Dict[str, Any]:
        clean_input = re.sub(r"\(.*?\)", "", product_or_standard).strip()
        clean_query = re.sub(
            r"(?i)\b(generate|create|a|an|compliance|audit|checklist|for|list|show|me|retrieves)\b",
            "",
            clean_input
        ).strip()

        search_term = clean_query if clean_query else clean_input
        chunks = self.retrieve(search_term, top_k=4)
        
        if not chunks:
            return {
                "standard_no": "N/A",
                "product_title": search_term,
                "raw_material_checks": ["No matching standards found in database."],
                "mandatory_lab_equipment": ["N/A"],
                "factory_quality_checks": ["N/A"]
            }

        context_text = "\n\n".join([
            f"Document ({c['metadata'].get('standard_no', 'N/A')} - {c['metadata'].get('title', 'N/A')}):\n{c['content']}" 
            for c in chunks
        ])
        
        prompt = f"""Extract specific mandatory compliance checks and testing equipment for: '{search_term}'.
Context documents:
{context_text}

Extract concrete items directly mentioned in the context.

Return ONLY a raw JSON object formatted as follows:
{{
  "standard_no": "Standard Number",
  "product_title": "Product Title",
  "raw_material_checks": ["Check 1", "Check 2"],
  "mandatory_lab_equipment": ["Equipment 1", "Equipment 2"],
  "factory_quality_checks": ["Check 1", "Check 2"]
}}"""

        try:
            model = genai.GenerativeModel(
                self._get_active_model(),
                generation_config={"response_mime_type": "application/json"}
            )
            response = model.generate_content(prompt)
            
            raw_output = response.text or "{}"
            clean_json = re.sub(r"```json|```", "", raw_output).strip()
            return json.loads(clean_json)

        except Exception:
            std_no = chunks[0]["metadata"].get("standard_no", "IS Standard")
            prod_title = chunks[0]["metadata"].get("title", search_term)
            return {
                "standard_no": std_no,
                "product_title": prod_title,
                "raw_material_checks": [f"Verify input material specifications per {std_no}."],
                "mandatory_lab_equipment": ["Calibrated test instruments per standard requirement."],
                "factory_quality_checks": ["Maintain batch inspection quality logs."]
            }

    # -------------------------------------------------------------------------
    # Feature 4: Product Lookup
    # -------------------------------------------------------------------------
    def get_product_description(self, query: str) -> str:
        search_query = (query or "").strip()
        if not search_query:
            return "No product specifications found for the empty search query."

        normalized_query = re.sub(r"\(.*?\)", "", search_query).strip()
        normalized_query = re.sub(r"(?i)\b(?:product|specification|details|lookup|for|show|me)\b", "", normalized_query).strip()
        search_value = normalized_query or search_query

        chunks = self.retrieve(search_value, top_k=4)
        if not chunks:
            return f"No product specifications found for **{search_value}**."

        results_str = ""
        for c in chunks:
            std = c['metadata'].get('standard_no', 'General Specification')
            results_str += f"### Specification: {std}\n{c['content']}\n\n---\n"
        return results_str

    # -------------------------------------------------------------------------
    # Feature 5: Testing Labs Directory Search
    # -------------------------------------------------------------------------
    def locate_testing_labs(self, category: str) -> List[Dict[str, str]]:
        cat_lower = category.lower()
        
        lab_database = {
            "hand tools": [
                {"Lab ID": "BIS-LAB-001", "Facility Name": "National Test House (NTH)", "Location": "Kolkata / Mumbai", "Status": "Active / Recognized"},
                {"Lab ID": "BIS-LAB-002", "Facility Name": "Shriram Institute for Industrial Research", "Location": "Delhi", "Status": "Active / Recognized"}
            ],
            "electrical": [
                {"Lab ID": "BIS-LAB-003", "Facility Name": "Central Power Research Institute (CPRI)", "Location": "Bengaluru / Noida", "Status": "Active / Recognized"},
                {"Lab ID": "BIS-LAB-004", "Facility Name": "Electrical Research and Development Association (ERDA)", "Location": "Vadodara", "Status": "Active / Recognized"}
            ],
            "steel": [
                {"Lab ID": "BIS-LAB-005", "Facility Name": "CSIR-National Metallurgical Laboratory", "Location": "Jamshedpur", "Status": "Active / Recognized"},
                {"Lab ID": "BIS-LAB-006", "Facility Name": "Metallurgical Services Test House", "Location": "Chennai", "Status": "Active / Recognized"}
            ],
            "food products": [
                {"Lab ID": "BIS-LAB-007", "Facility Name": "Central Food Technological Research Institute (CFTRI)", "Location": "Mysuru", "Status": "Active / Recognized"},
                {"Lab ID": "BIS-LAB-008", "Facility Name": "National Food Testing Laboratory", "Location": "Ghaziabad", "Status": "Active / Recognized"}
            ]
        }

        for key, labs in lab_database.items():
            if key in cat_lower or cat_lower in key:
                return labs

        return [
            {
                "Lab ID": "BIS-LAB-101",
                "Facility Name": f"Recognized Central Test Facility ({category.title()})",
                "Location": "Regional Standard Laboratory",
                "Status": "Active / Recognized"
            }
        ]