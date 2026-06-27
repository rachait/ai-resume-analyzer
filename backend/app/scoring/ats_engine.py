"""
Rule-based ATS scoring engine.
Mirrors what real ATS systems check: keyword presence, section completeness,
formatting hygiene, and structural signals.
"""
from __future__ import annotations
from typing import Dict, List


def score_skills_match(matched_keywords: List[str], total_keywords: List[str]) -> float:
    if not total_keywords:
        return 100.0
    return round(100.0 * len(matched_keywords) / len(total_keywords), 1)


def score_section_presence(structured_resume: Dict) -> float:
    """Checks whether key resume sections exist and have content."""
    required_sections = ["experience", "education", "skills"]
    optional_sections = ["projects", "certifications", "summary"]

    present_required = sum(1 for s in required_sections if structured_resume.get(s))
    present_optional = sum(1 for s in optional_sections if structured_resume.get(s))

    # required sections worth more
    score = (present_required / len(required_sections)) * 70
    score += (present_optional / len(optional_sections)) * 30
    return round(score, 1)


def score_formatting(raw_text: str) -> float:
    """
    Heuristic formatting score: penalizes extremely short resumes,
    excessive special characters, or wall-of-text with no line breaks
    (often a sign of bad PDF parsing / tables / columns, which trips up ATS).
    """
    score = 100.0
    word_count = len(raw_text.split())

    if word_count < 150:
        score -= 30  # too sparse
    elif word_count > 1200:
        score -= 10  # likely too long for ATS preference

    line_count = raw_text.count("\n")
    if word_count > 0 and line_count < word_count / 100:
        score -= 20  # suspiciously few line breaks -> possible multi-column layout

    special_char_ratio = sum(1 for c in raw_text if c in "■●◆▪""''") / max(len(raw_text), 1)
    if special_char_ratio > 0.01:
        score -= 10  # decorative bullets/icons that ATS parsers often mangle

    return round(max(score, 0), 1)


def score_experience_relevance(matched_keywords: List[str], experience_lines: List[str]) -> float:
    """
    Rough proxy: what fraction of matched keywords actually appear within
    the experience section specifically (vs. just a skills list)?
    """
    if not matched_keywords or not experience_lines:
        return 50.0  # neutral default when we can't tell
    exp_text = " ".join(experience_lines).lower()
    hits = sum(1 for kw in matched_keywords if kw.lower() in exp_text)
    return round(100.0 * hits / len(matched_keywords), 1)


def compute_ats_score(
    structured_resume: Dict,
    matched_keywords: List[str],
    all_jd_keywords: List[str],
) -> Dict:
    skills = score_skills_match(matched_keywords, all_jd_keywords)
    sections = score_section_presence(structured_resume)
    formatting = score_formatting(structured_resume.get("raw_text", ""))
    experience = score_experience_relevance(
        matched_keywords, structured_resume.get("experience", [])
    )

    # Weighted overall score
    weights = {"skills": 0.40, "sections": 0.20, "formatting": 0.15, "experience": 0.25}
    overall = (
        skills * weights["skills"]
        + sections * weights["sections"]
        + formatting * weights["formatting"]
        + experience * weights["experience"]
    )

    return {
        "overall_ats_score": round(overall, 1),
        "breakdown": {
            "skills_match": skills,
            "section_completeness": sections,
            "formatting": formatting,
            "experience_relevance": experience,
        },
    }
