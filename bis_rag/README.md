# BIS RAG Assistant

A small Retrieval-Augmented Generation (RAG) assistant for answering questions
about Bureau of Indian Standards (BIS) standards and certification schemes. It
searches the local BIS knowledge base and uses an LLM only to write a grounded,
cited answer.

## Prerequisites

- Python 3.10 or 3.11
- A Gemini API key (recommended), or an OpenAI or Anthropic API key
- Internet access on the first run to download the embedding model and to call
  the chosen LLM

## Setup (Windows PowerShell)

Clone the repository and open its folder:

```powershell
git clone https://github.com/SwapnajGharat/FlowMind.git
cd FlowMind
```

Create and activate a clean virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install the dependencies:

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Create a file named `.env` in the project folder. For Gemini, it should contain:

```env
GEMINI_API_KEY=your_key_here
LLM_BACKEND=gemini
```

Do not commit or share `.env`; it contains a private API key.

## Run the assistant

Build the local vector database. Run this once after cloning, and again whenever
`sample_data.json` changes:

```powershell
python ingest.py
```

Start the chat:

```powershell
python rag_pipeline.py
```

Example question:

```text
What BIS standard applies to electric kettles?
```

Type `exit` to close the assistant.

The first run may take longer because the embedding model is downloaded and
loaded locally. Subsequent questions stream their answer as it is generated.

## Optional checks

Run the retrieval and pipeline checks:

```powershell
python test_pipeline.py
```

## Other LLM backends

Instead of Gemini, put one of these pairs in `.env`:

```env
OPENAI_API_KEY=your_key_here
LLM_BACKEND=openai
```

```env
ANTHROPIC_API_KEY=your_key_here
LLM_BACKEND=anthropic
```

## Project files

- `sample_data.json` — BIS source records used by the assistant
- `ingest.py` — creates the local Chroma vector database
- `rag_pipeline.py` — retrieval, prompt construction, and LLM response flow
- `test_pipeline.py` — retrieval and pipeline checks
- `chroma_db/` — generated local database; it is intentionally not committed
