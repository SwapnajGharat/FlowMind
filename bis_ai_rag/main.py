"""
main.py
FastAPI backend API serving EnhancedBISAssistant methods to web frontends.
"""

from typing import Any, Dict

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app_features import EnhancedBISAssistant

app = FastAPI(title="BIS AI Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

assistant = EnhancedBISAssistant()


class QueryRequest(BaseModel):
    query: str = ""


@app.post("/api/chat")
async def chat_endpoint(req: QueryRequest):
    query = (req.query or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        response = assistant.ask_chat(query)
        return {"response": response}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/transcribe")
async def transcribe_endpoint(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()
        transcription = assistant.transcribe_audio(audio_bytes, file.filename or "audio.webm")
        return {"transcription": transcription}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/voice-query")
async def voice_query_endpoint(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()
        transcribed_text = assistant.transcribe_audio(audio_bytes, file.filename or "audio.webm")
        answer = assistant.ask_chat(transcribed_text)
        return {
            "transcription": transcribed_text,
            "response": answer,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/audit")
async def audit_endpoint(req: QueryRequest):
    query = (req.query or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Audit query cannot be empty.")

    try:
        checklist = assistant.generate_audit_checklist(query)
        return {"data": checklist}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/product")
async def product_endpoint(req: QueryRequest):
    query = (req.query or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Product query cannot be empty.")

    try:
        details = assistant.get_product_description(query)
        return {"details": details}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/labs")
async def labs_endpoint(category: str):
    if not category or not category.strip():
        raise HTTPException(status_code=400, detail="Category cannot be empty.")

    try:
        labs = assistant.locate_testing_labs(category)
        return {"labs": labs}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
