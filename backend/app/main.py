from __future__ import annotations
from dotenv import load_dotenv

load_dotenv()  # must run before app.llm.client reads env vars

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import upload, analysis, llm_routes

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Parses resumes/JDs, scores ATS + semantic match, and generates "
                 "AI-powered review, rewrites, cover letters, and interview questions.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(analysis.router)
app.include_router(llm_routes.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "ai-resume-analyzer"}


@app.get("/health")
def health():
    return {"status": "healthy"}
