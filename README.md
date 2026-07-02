# 🚀 AI Resume Analyzer

> An AI-powered Resume Analyzer that evaluates resumes against job descriptions using ATS scoring, semantic similarity, keyword analysis, and Large Language Models (LLMs).

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Groq](https://img.shields.io/badge/Groq-LLM-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 📖 Overview

AI Resume Analyzer helps job seekers improve their resumes by comparing them against a target Job Description (JD).

The application performs:

- ✅ ATS Score Analysis
- ✅ Semantic Similarity Analysis
- ✅ Keyword Matching
- ✅ Missing Skills Detection
- ✅ AI Resume Review
- ✅ Resume Optimization
- ✅ Cover Letter Generation
- ✅ Interview Question Generation

---

# ✨ Features

## Resume Analysis

- Upload PDF or DOCX resumes
- Paste or upload Job Descriptions
- ATS Score Calculation
- Resume Section Detection
- Keyword Matching
- Missing Skills Identification
- Semantic Similarity Analysis

---

## AI Features

Powered by **Groq Llama 3.3 70B**

- AI Resume Review
- Resume Optimization
- Resume Bullet Rewriter
- Tailored Cover Letter Generator
- AI Interview Questions

---

## Dashboard

- ATS Score
- Semantic Match
- AI Review Score
- ATS Breakdown Charts
- Matched Keywords
- Missing Keywords
- Resume Strengths
- AI Suggestions
- Requirement Coverage

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Recharts
- React Router

---

## Backend

- FastAPI
- Python
- Pydantic
- Uvicorn
- PyMuPDF
- pdfplumber
- python-docx

---

## AI & NLP

- Groq API
- Llama 3.3 70B Versatile
- Sentence Transformers
- KeyBERT
- RapidFuzz
- Scikit-learn

---

## DevOps

- Docker
- Docker Compose
- GitHub Actions (Coming Soon)

---

# 📂 Project Structure

```text
resume-analyzer/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── llm/
│   │   ├── models/
│   │   ├── parsers/
│   │   ├── scoring/
│   │   └── utils/
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── .github/
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/rachait/ai-resume-analyzer.git

cd ai-resume-analyzer
```

---

# Backend Setup

```bash
cd backend

python -m venv .venv
```

Windows

```bash
.venv\Scripts\activate
```

Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create `.env`

```env
LLM_PROVIDER=groq

GROQ_API_KEY=YOUR_API_KEY

GROQ_MODEL=llama-3.3-70b-versatile

MAX_UPLOAD_SIZE_MB=10
```

Run Backend

```bash
uvicorn app.main:app --reload
```

Backend

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend

```
http://localhost:5173
```

---

# Docker

```bash
docker compose up --build
```

---

# API Endpoints

| Endpoint | Method | Description |
|-----------|--------|-------------|
| /api/upload-resume | POST | Upload Resume |
| /api/upload-jd | POST | Upload Job Description |
| /api/analyze | POST | ATS Analysis |
| /api/review | POST | AI Resume Review |
| /api/rewrite-bullets | POST | Rewrite Resume Bullets |
| /api/optimize | POST | Optimize Resume |
| /api/cover-letter | POST | Generate Cover Letter |
| /api/interview-questions | POST | Generate Interview Questions |

---

# Workflow

```text
Resume
      │
      ▼
Document Parsing
      │
      ▼
ATS Engine
      │
      ▼
Keyword Analysis
      │
      ▼
Semantic Similarity
      │
      ▼
Groq LLM
      │
      ▼
Dashboard
```

---

# Current Features

- Resume Upload
- JD Upload
- Resume Parsing
- ATS Score
- Semantic Match
- Keyword Matching
- AI Resume Review
- Resume Optimization
- Cover Letter
- Interview Questions

---

# Upcoming Features

- AI Chat Assistant
- Resume History
- Authentication
- Dashboard Analytics
- PDF Report Export
- Resume Version Comparison
- GitHub Actions CI/CD
- Cloud Deployment
- Multi Resume Analysis
- Resume Templates
- AI Career Advisor

---

# Screenshots

### Landing Page

_Add Screenshot_

### Dashboard

_Add Screenshot_

### Resume Review

_Add Screenshot_

---

# Future Roadmap

- Modern Dashboard UI
- Circular ATS Charts
- Skill Radar
- Resume PDF Export
- Resume Comparison
- Chat with Resume
- Multi-Language Support
- Cloud Deployment
- Database Integration
- Authentication

---

# Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added feature"
```

4. Push

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# Author

**Rachait Talwar**

AI • Machine Learning • GenAI • FastAPI • React

GitHub

https://github.com/rachait

---

# License

MIT License

---

⭐ If you found this project useful, don't forget to Star the repository!
