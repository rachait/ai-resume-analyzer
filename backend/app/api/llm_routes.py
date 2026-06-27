from __future__ import annotations
from fastapi import APIRouter, HTTPException

from app.utils.session_store import session_store
from app.llm import service as llm_service
from app.llm.client import LLMError
from app.models.schemas import AnalyzeRequest, RewriteBulletsRequest

router = APIRouter(prefix="/api", tags=["llm"])


def _get_session_or_404(session_id: str) -> dict:
    session = session_store.get(session_id)
    if session is None:
        raise HTTPException(404, "Session not found")
    if "resume_raw_text" not in session or "jd_raw_text" not in session:
        raise HTTPException(400, "Both resume and job description must be uploaded first")
    return session


def _handle_llm_call(fn, *args):
    try:
        return fn(*args)
    except LLMError as e:
        raise HTTPException(502, f"LLM provider error: {e}")


@router.post("/review")
def review(req: AnalyzeRequest):
    session = _get_session_or_404(req.session_id)
    result = _handle_llm_call(llm_service.review_resume, session["resume_raw_text"], session["jd_raw_text"])
    session_store.update(req.session_id, last_review=result)
    return result


@router.post("/rewrite-bullets")
def rewrite_bullets(req: RewriteBulletsRequest):
    session = _get_session_or_404(req.session_id)
    if not req.bullets:
        raise HTTPException(400, "Provide at least one bullet to rewrite")
    result = _handle_llm_call(llm_service.rewrite_bullets, req.bullets, session["jd_raw_text"])
    return result


@router.post("/optimize")
def optimize(req: AnalyzeRequest):
    session = _get_session_or_404(req.session_id)
    result = _handle_llm_call(llm_service.optimize_resume, session["resume_raw_text"], session["jd_raw_text"])
    return result


@router.post("/cover-letter")
def cover_letter(req: AnalyzeRequest):
    session = _get_session_or_404(req.session_id)
    result = _handle_llm_call(llm_service.generate_cover_letter, session["resume_raw_text"], session["jd_raw_text"])
    return result


@router.post("/interview-questions")
def interview_questions(req: AnalyzeRequest):
    session = _get_session_or_404(req.session_id)
    result = _handle_llm_call(
        llm_service.generate_interview_questions, session["resume_raw_text"], session["jd_raw_text"]
    )
    return result
