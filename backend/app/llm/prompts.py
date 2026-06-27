"""
Prompt templates for resume review, bullet rewriting, optimization,
cover letter generation, and interview question generation.
"""

REVIEW_SYSTEM_PROMPT = """You are an experienced ATS recruiter and technical resume reviewer.
You evaluate resumes against a specific job description and give precise, actionable feedback.
Always respond with ONLY valid JSON matching the requested schema. No markdown, no commentary."""

REVIEW_USER_PROMPT_TEMPLATE = """Resume:
---
{resume_text}
---

Job Description:
---
{jd_text}
---

Evaluate this resume against the job description. Return JSON with this exact schema:
{{
  "overall_score": <0-100 integer>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "suggestions": [<string>, ...]
}}
"""

BULLET_REWRITE_SYSTEM_PROMPT = """You are a professional resume writer specializing in tech roles.
You rewrite weak, vague resume bullets into strong, achievement-oriented statements using
action verbs, specific technologies, and measurable impact where plausible. Never invent
metrics that contradict the original meaning — if no metric is given, focus on scope and
technical specificity instead. Respond with ONLY valid JSON."""

BULLET_REWRITE_USER_PROMPT_TEMPLATE = """Job Description context (for relevant terminology):
---
{jd_text}
---

Rewrite each of these resume bullets to be stronger and more specific. Keep them truthful
to the original meaning — do not fabricate numbers or technologies not implied by the original.

Original bullets:
{bullets_text}

Return JSON with this exact schema:
{{
  "rewrites": [
    {{"original": <string>, "rewritten": <string>}}
  ]
}}
"""

OPTIMIZE_SYSTEM_PROMPT = """You are a resume optimization expert. You produce improved versions
of resume sections tailored to a specific job description, while staying truthful to the
candidate's actual background. Respond with ONLY valid JSON."""

OPTIMIZE_USER_PROMPT_TEMPLATE = """Resume:
---
{resume_text}
---

Job Description:
---
{jd_text}
---

Produce improved versions of this candidate's resume sections, tailored to the job description.
Return JSON with this exact schema:
{{
  "improved_summary": <string>,
  "improved_skills": [<string>, ...],
  "improved_experience_bullets": [<string>, ...],
  "improved_projects_bullets": [<string>, ...]
}}
"""

COVER_LETTER_SYSTEM_PROMPT = """You are a professional cover letter writer. You write concise,
specific, non-generic cover letters (under 350 words) that connect the candidate's real
background to the target role. Avoid clichés like "I am a perfect fit". Respond with ONLY
valid JSON."""

COVER_LETTER_USER_PROMPT_TEMPLATE = """Resume:
---
{resume_text}
---

Job Description:
---
{jd_text}
---

Write a tailored cover letter. Return JSON with this exact schema:
{{
  "cover_letter": <string, full letter text including greeting and sign-off>
}}
"""

INTERVIEW_QUESTIONS_SYSTEM_PROMPT = """You are a senior technical interviewer. You generate
relevant interview questions based on the skills required in a job description and the
candidate's resume. Respond with ONLY valid JSON."""

INTERVIEW_QUESTIONS_USER_PROMPT_TEMPLATE = """Resume:
---
{resume_text}
---

Job Description:
---
{jd_text}
---

Generate 8-12 interview questions grouped by topic, based on the skills in the job description
and the candidate's background. Return JSON with this exact schema:
{{
  "topics": [
    {{
      "topic": <string>,
      "questions": [<string>, ...]
    }}
  ]
}}
"""
