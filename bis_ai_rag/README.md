# AI-Powered BIS Compliance Assistant

This is the second BIS RAG implementation in FlowMind. It provides a FastAPI
backend, a Streamlit interface, and a standalone browser UI.

## Setup

From this folder, create a virtual environment and install the dependencies:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Create a `.env` file in this folder containing your Groq API key:

```env
GROQ_API_KEY=your_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

Build the local vector database after changing `sample_data.json`:

```powershell
python ingest.py
```

## Run

Start the FastAPI API for the standalone `index.html` interface:

```powershell
uvicorn main:app --reload
```

The API runs on `http://127.0.0.1:8000`. Keep it running, then start the
frontend API (`cd ../frontend; npm run server`) and React app (`npm run dev`)
in separate terminals. The frontend server securely forwards RAG requests to
this API and records the resulting history in its SQLite database.

Or start the Streamlit interface:

```powershell
streamlit run streamlit_app.py
```

All data and ChromaDB paths are resolved relative to this folder, so these
commands also work when launched from elsewhere in the repository.
