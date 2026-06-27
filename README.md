# AI Resume Analyzer

Upload a resume + a job description, and get back an ATS score, semantic match
score, missing-keyword analysis, and AI-generated review, cover letter, and
interview questions.

This is a working **core implementation** of the full project spec — upload,
parsing, rule-based ATS scoring, semantic similarity, keyword gap analysis,
and LLM-powered review/cover-letter/interview-question generation are all
wired up end-to-end. Bonus features from the original spec (auth, persistent
history, multi-resume batch analysis, ChromaDB-backed version history) are
**not** included — see "Extending this" below for how to add them.

## Stack

- **Backend:** FastAPI, PyMuPDF/pdfplumber/python-docx (parsing), KeyBERT +
  RapidFuzz (keyword extraction), sentence-transformers (semantic match),
  OpenAI or Ollama (LLM features)
- **Frontend:** React + TypeScript + Vite, Tailwind CSS, Recharts, react-dropzone

## Quick start (without Docker)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm

cp .env.example .env
# edit .env: set OPENAI_API_KEY, or switch LLM_PROVIDER=ollama and run Ollama locally

uvicorn app.main:app --reload --port 8000
```

The first request will download the `all-MiniLM-L6-v2` sentence-transformer
and KeyBERT model (~90MB) — this happens once and is cached.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Quick start (Docker)

```bash
cp backend/.env.example backend/.env
# edit backend/.env with your API key
docker compose up --build
```

## How it works

1. **Upload** — resume (PDF/DOCX) and job description (file or pasted text)
   go to `/api/upload-resume` and `/api/upload-jd`. Text is extracted and
   resumes are split into sections (skills, experience, education, etc.)
   using heuristic header matching.
2. **Scoring** (`/api/analyze`) — runs three independent analyses:
   - **Keyword extraction**: KeyBERT pulls key phrases from the JD; RapidFuzz
     fuzzy-matches them against the resume so "Postgres" matches "PostgreSQL".
   - **ATS score**: rule-based, weighted combination of skill match, section
     completeness, formatting hygiene, and experience relevance.
   - **Semantic match**: embeds resume lines and JD requirement lines with
     sentence-transformers, then for each JD line finds the best-matching
     resume line by cosine similarity — catches paraphrased matches that
     keyword matching misses (e.g. "Built REST APIs" ↔ "developing backend
     APIs").
3. **AI features** (`/api/review`, `/api/rewrite-bullets`, `/api/optimize`,
   `/api/cover-letter`, `/api/interview-questions`) — all call a
   provider-agnostic LLM client (`app/llm/client.py`) so you can swap between
   OpenAI and a local Ollama model via one `.env` variable. JSON responses
   include a repair-retry pass since local models are less reliable at
   strict JSON formatting than hosted APIs.

Sessions are stored **in-memory** (`app/utils/session_store.py`) — simple by
design for this MVP. Restarting the backend clears all sessions.

## Extending this

- **Persistence**: swap `SessionStore` for Postgres/Redis — the interface
  (`create`, `get`, `update`, `require`) is intentionally small.
- **Auth & history**: add a `users` table, attach `user_id` to sessions, and
  persist sessions instead of keeping them in memory.
- **Resume/cover-letter PDF export**: the `/api/optimize` and
  `/api/cover-letter` endpoints already return structured text — wire that
  into a PDF generation step (e.g. via the `docx` Python library + a
  PDF conversion step, or `reportlab`).
- **Batch analysis**: loop the existing `/api/analyze` pipeline over multiple
  uploaded resumes against one JD.

## API reference

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/upload-resume` | POST | Upload resume, returns `session_id` |
| `/api/upload-jd` | POST | Upload/paste JD for an existing session |
| `/api/analyze` | POST | Full ATS + semantic + keyword analysis |
| `/api/ats-score` | POST | ATS score only |
| `/api/semantic-score` | POST | Semantic match only |
| `/api/keyword-analysis` | POST | Keyword gap analysis only |
| `/api/review` | POST | LLM resume review (score, strengths, weaknesses, suggestions) |
| `/api/rewrite-bullets` | POST | LLM rewrite of specific resume bullets |
| `/api/optimize` | POST | LLM-generated improved resume sections |
| `/api/cover-letter` | POST | LLM-generated tailored cover letter |
| `/api/interview-questions` | POST | LLM-generated interview questions |

Interactive docs available at `http://localhost:8000/docs` once the backend
is running.

## Notes on privacy

Resumes contain personal data. This MVP stores them in memory only (cleared
on restart) and never writes uploaded files to disk. If you add persistence,
add an explicit retention/deletion policy and mention it in your UI.
