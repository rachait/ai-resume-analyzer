"""
Lightweight semantic similarity using TF-IDF + cosine similarity.

No PyTorch
No HuggingFace
Fast startup
Good enough for ATS matching
"""

from __future__ import annotations

from typing import List, Dict

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def _split_into_lines(text: str) -> List[str]:
    lines = [line.strip("•- \t") for line in text.splitlines()]
    return [line for line in lines if len(line.split()) >= 3]


def compute_semantic_match(
    resume_text: str,
    jd_text: str,
) -> Dict:

    resume_lines = _split_into_lines(resume_text)
    jd_lines = _split_into_lines(jd_text)

    if not resume_lines or not jd_lines:
        return {
            "overall_semantic_score": 0,
            "details": [],
        }

    documents = resume_lines + jd_lines

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
    )

    vectors = vectorizer.fit_transform(documents)

    resume_vectors = vectors[: len(resume_lines)]
    jd_vectors = vectors[len(resume_lines) :]

    sim_matrix = cosine_similarity(
        jd_vectors,
        resume_vectors,
    )

    details = []
    scores = []

    for i, jd_line in enumerate(jd_lines):

        best_index = int(np.argmax(sim_matrix[i]))
        best_score = float(sim_matrix[i][best_index])

        scores.append(best_score)

        details.append(
            {
                "jd_requirement": jd_line,
                "best_matching_resume_line": resume_lines[best_index],
                "similarity": round(best_score, 3),
            }
        )

    overall = round(float(np.mean(scores)) * 100, 1)

    details.sort(key=lambda x: x["similarity"])

    return {
        "overall_semantic_score": overall,
        "details": details,
    }