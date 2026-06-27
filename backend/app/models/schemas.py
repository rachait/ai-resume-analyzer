from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel


class UploadResponse(BaseModel):
    session_id: str
    filename: str
    word_count: int
    preview: str


class AnalyzeRequest(BaseModel):
    session_id: str


class KeywordAnalysis(BaseModel):
    matched: List[str]
    missing: List[str]
    all_jd_keywords: List[str]


class ATSBreakdown(BaseModel):
    skills_match: float
    section_completeness: float
    formatting: float
    experience_relevance: float


class ATSResult(BaseModel):
    overall_ats_score: float
    breakdown: ATSBreakdown


class SemanticDetail(BaseModel):
    jd_requirement: str
    best_matching_resume_line: str
    similarity: float


class SemanticResult(BaseModel):
    overall_semantic_score: float
    details: List[SemanticDetail]


class FullAnalysisResponse(BaseModel):
    session_id: str
    ats: ATSResult
    semantic: SemanticResult
    keywords: KeywordAnalysis


class RewriteBulletsRequest(BaseModel):
    session_id: str
    bullets: List[str]


class ReviewResult(BaseModel):
    overall_score: int
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
