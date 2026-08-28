# 🇮🇳 AI-Powered BIS Compliance Assistant

An intelligent, multimodal compliance platform designed for the **Bureau of Indian Standards (BIS)** to assist MSMEs and field officers in querying Indian Standards (IS), generating automated self-audit checklists, and finding recognized testing laboratories.

---

## 🌟 Key Features

* **Multimodal Input**: Supports text and regional voice queries powered by Groq Whisper transcription.
* **RAG-Backed Regulatory Search**: Utilizes ChromaDB vector storage paired with Llama 3.3 models for accurate, hallucination-free compliance guidance grounded strictly in official IS documents.
* **Automated MSME Audit Checklists**: Automatically extracts required lab equipment, raw material checks, and calculates live compliance readiness scores.
* **Product & Lab Directory**: Direct lookup tools for technical IS specifications and nearby recognized testing facility mapping.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    UI["Streamlit Frontend (streamlit_app.py)"] --> Backend["Core Engine (app_features.py)"]
    Backend --> Chroma[("ChromaDB Vector Store")]
    Backend --> Groq["Groq API (Whisper & Llama 3.3)"]