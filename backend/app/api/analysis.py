from __future__ import annotations
from fastapi import APIRouter, HTTPException

from app.utils.session_store import session_store
from app.scoring.keyword_extraction import extract_keywords_from_text, find_missing_keywords
from app.scoring.ats_engine import compute_ats_score
from app.scoring.semantic_match import compute_semantic_match
from app.models.schemas import AnalyzeRequest, FullAnalysisResponse

router = APIRouter(prefix="/api", tags=["analysis"])


def _get_session_or_404(session_id: str) -> dict:
    session = session_store.get(session_id)
    if session is None:
        raise HTTPException(404, "Session not found")
    if "resume_raw_text" not in session:
        raise HTTPException(400, "Resume not uploaded for this session")
    if "jd_raw_text" not in session:
        raise HTTPException(400, "Job description not uploaded for this session")
    return session


@router.post("/keyword-analysis")
def keyword_analysis(req: AnalyzeRequest):
    session = _get_session_or_404(req.session_id)
    jd_keywords = extract_keywords_from_text(session["jd_raw_text"])
    result = find_missing_keywords(jd_keywords, session["resume_raw_text"])
    session_store.update(req.session_id, last_keyword_result={**result, "all_jd_keywords": jd_keywords})
    return {**result, "all_jd_keywords": jd_keywords}


@router.post("/ats-score")
def ats_score(req: AnalyzeRequest):
    session = _get_session_or_404(req.session_id)

    # Reuse cached keyword analysis if available, else compute fresh
    kw_result = session.get("last_keyword_result")
    if kw_result is None:
        jd_keywords = extract_keywords_from_text(session["jd_raw_text"])
        kw_result = find_missing_keywords(jd_keywords, session["resume_raw_text"])
        kw_result["all_jd_keywords"] = jd_keywords
        session_store.update(req.session_id, last_keyword_result=kw_result)

    result = compute_ats_score(
        session["resume_structured"],
        kw_result["matched"],
        kw_result["all_jd_keywords"],
    )
    return result


@router.post("/semantic-score")
def semantic_score(req: AnalyzeRequest):
    session = _get_session_or_404(req.session_id)
    result = compute_semantic_match(session["resume_raw_text"], session["jd_raw_text"])
    return result


@router.post("/analyze", response_model=FullAnalysisResponse)
def full_analysis(req: AnalyzeRequest):
    """Convenience endpoint: runs keyword + ATS + semantic analysis in one call."""
    session = _get_session_or_404(req.session_id)

    jd_keywords = extract_keywords_from_text(session["jd_raw_text"])
    kw_result = find_missing_keywords(jd_keywords, session["resume_raw_text"])
    kw_result["all_jd_keywords"] = jd_keywords
    session_store.update(req.session_id, last_keyword_result=kw_result)

    ats_result = compute_ats_score(
        session["resume_structured"], kw_result["matched"], jd_keywords
    )
    semantic_result = compute_semantic_match(session["resume_raw_text"], session["jd_raw_text"])

    return FullAnalysisResponse(
        session_id=req.session_id,
        ats=ats_result,
        semantic=semantic_result,
        keywords=kw_result,
    )
