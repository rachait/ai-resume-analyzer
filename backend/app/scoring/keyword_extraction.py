"""
Keyword extraction and gap analysis.
Uses KeyBERT for JD keyword extraction and RapidFuzz for fuzzy matching
against resume content (so "Postgres" matches "PostgreSQL", etc).
"""
from __future__ import annotations
from functools import lru_cache
from typing import List, Dict

from keybert import KeyBERT
from rapidfuzz import fuzz

# A small curated tech-skill list helps recall for short JDs.
# In production you'd expand this or use a NER model trained on skills.
COMMON_TECH_TERMS = [
    "python", "java", "javascript", "typescript", "react", "node.js", "fastapi",
    "django", "flask", "docker", "kubernetes", "aws", "azure", "gcp", "terraform",
    "ci/cd", "redis", "kafka", "postgresql", "mysql", "mongodb", "graphql", "rest api",
    "microservices", "git", "linux", "sql", "nosql", "machine learning", "deep learning",
    "nlp", "llm", "rag", "langchain", "pytorch", "tensorflow", "spark", "airflow",
    "agile", "scrum", "unit testing", "ci", "cd",
]


@lru_cache(maxsize=1)
def get_keybert_model() -> KeyBERT:
    # Loaded once and cached; sentence-transformers backend.
    return KeyBERT(model="all-MiniLM-L6-v2")


def extract_keywords_from_text(text: str, top_n: int = 20) -> List[str]:
    kw_model = get_keybert_model()
    keywords = kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=(1, 2),
        stop_words="english",
        top_n=top_n,
        use_mmr=True,
        diversity=0.5,
    )
    extracted = [kw for kw, score in keywords]

    # Also check for any common tech terms present verbatim in the text
    lowered = text.lower()
    for term in COMMON_TECH_TERMS:
        if term in lowered and term not in extracted:
            extracted.append(term)

    return extracted


def find_missing_keywords(
    jd_keywords: List[str], resume_text: str, fuzzy_threshold: int = 80
) -> Dict[str, List[str]]:
    """
    For each JD keyword, check if it (or a close fuzzy match) appears in resume text.
    Returns matched and missing keyword lists.
    """
    resume_lower = resume_text.lower()
    matched, missing = [], []

    for kw in jd_keywords:
        kw_lower = kw.lower()
        if kw_lower in resume_lower:
            matched.append(kw)
            continue

        # Fuzzy match against words/phrases in the resume
        score = fuzz.partial_ratio(kw_lower, resume_lower)
        if score >= fuzzy_threshold:
            matched.append(kw)
        else:
            missing.append(kw)

    return {"matched": matched, "missing": missing}
