"""
Semantic similarity scoring between resume bullets and JD requirement lines.
Goes beyond keyword matching: "Built REST APIs" should match
"Experience developing backend APIs" even with zero shared keywords.
"""
from __future__ import annotations
from functools import lru_cache
from typing import List, Dict

import numpy as np
from sentence_transformers import SentenceTransformer


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    return SentenceTransformer("all-MiniLM-L6-v2")


def _split_into_lines(text: str) -> List[str]:
    lines = [l.strip("•- \t") for l in text.splitlines()]
    return [l for l in lines if len(l.split()) >= 3]  # ignore very short/empty lines


def compute_semantic_match(resume_text: str, jd_text: str) -> Dict:
    """
    Splits both documents into lines, embeds them, and for each JD requirement
    line finds the best-matching resume line via cosine similarity.
    Returns an overall score plus per-requirement detail.
    """
    model = get_embedding_model()

    resume_lines = _split_into_lines(resume_text)
    jd_lines = _split_into_lines(jd_text)

    if not resume_lines or not jd_lines:
        return {"overall_semantic_score": 0.0, "details": []}

    resume_embeddings = model.encode(resume_lines, normalize_embeddings=True)
    jd_embeddings = model.encode(jd_lines, normalize_embeddings=True)

    # cosine similarity matrix (dot product since vectors are normalized)
    sim_matrix = jd_embeddings @ resume_embeddings.T  # shape (jd_lines, resume_lines)

    details = []
    scores = []
    for i, jd_line in enumerate(jd_lines):
        best_idx = int(np.argmax(sim_matrix[i]))
        best_score = float(sim_matrix[i][best_idx])
        scores.append(best_score)
        details.append({
            "jd_requirement": jd_line,
            "best_matching_resume_line": resume_lines[best_idx],
            "similarity": round(best_score, 3),
        })

    overall = float(np.mean(scores)) * 100
    # sort details by lowest similarity first -> highlights biggest gaps
    details.sort(key=lambda d: d["similarity"])

    return {
        "overall_semantic_score": round(overall, 1),
        "details": details,
    }
