from __future__ import annotations
from typing import List

from app.llm.client import call_llm_json
from app.llm import prompts


def review_resume(resume_text: str, jd_text: str) -> dict:
    user_prompt = prompts.REVIEW_USER_PROMPT_TEMPLATE.format(
        resume_text=resume_text, jd_text=jd_text
    )
    return call_llm_json(prompts.REVIEW_SYSTEM_PROMPT, user_prompt)


def rewrite_bullets(bullets: List[str], jd_text: str) -> dict:
    bullets_text = "\n".join(f"- {b}" for b in bullets)
    user_prompt = prompts.BULLET_REWRITE_USER_PROMPT_TEMPLATE.format(
        jd_text=jd_text, bullets_text=bullets_text
    )
    return call_llm_json(prompts.BULLET_REWRITE_SYSTEM_PROMPT, user_prompt)


def optimize_resume(resume_text: str, jd_text: str) -> dict:
    user_prompt = prompts.OPTIMIZE_USER_PROMPT_TEMPLATE.format(
        resume_text=resume_text, jd_text=jd_text
    )
    return call_llm_json(prompts.OPTIMIZE_SYSTEM_PROMPT, user_prompt)


def generate_cover_letter(resume_text: str, jd_text: str) -> dict:
    user_prompt = prompts.COVER_LETTER_USER_PROMPT_TEMPLATE.format(
        resume_text=resume_text, jd_text=jd_text
    )
    return call_llm_json(prompts.COVER_LETTER_SYSTEM_PROMPT, user_prompt)


def generate_interview_questions(resume_text: str, jd_text: str) -> dict:
    user_prompt = prompts.INTERVIEW_QUESTIONS_USER_PROMPT_TEMPLATE.format(
        resume_text=resume_text, jd_text=jd_text
    )
    return call_llm_json(prompts.INTERVIEW_QUESTIONS_SYSTEM_PROMPT, user_prompt)
