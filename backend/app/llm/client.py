"""
Provider-agnostic LLM client.

Supported providers:
- groq
- openai
- ollama

Switch providers using:

LLM_PROVIDER=groq
"""

from __future__ import annotations

import json
import os

import httpx
from groq import Groq
from openai import OpenAI


LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq").lower()

# ---------- Groq ----------
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "llama-3.3-70b-versatile",
)

# ---------- OpenAI ----------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv(
    "OPENAI_MODEL",
    "gpt-4o-mini",
)

# ---------- Ollama ----------
OLLAMA_BASE_URL = os.getenv(
    "OLLAMA_BASE_URL",
    "http://localhost:11434",
)

OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    "llama3.1",
)


class LLMError(Exception):
    pass


# ======================================================
# GROQ
# ======================================================

def _call_groq(
    system_prompt: str,
    user_prompt: str,
    json_mode: bool,
) -> str:

    if not GROQ_API_KEY:
        raise LLMError("GROQ_API_KEY not found in .env")

    client = Groq(api_key=GROQ_API_KEY)

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        temperature=0.4,
        response_format=(
            {"type": "json_object"} if json_mode else None
        ),
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
    )

    return response.choices[0].message.content


# ======================================================
# OPENAI
# ======================================================

def _call_openai(
    system_prompt: str,
    user_prompt: str,
    json_mode: bool,
) -> str:

    if not OPENAI_API_KEY:
        raise LLMError("OPENAI_API_KEY not found in .env")

    client = OpenAI(api_key=OPENAI_API_KEY)

    kwargs = {}

    if json_mode:
        kwargs["response_format"] = {
            "type": "json_object"
        }

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        temperature=0.4,
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        **kwargs,
    )

    return response.choices[0].message.content


# ======================================================
# OLLAMA
# ======================================================

def _call_ollama(
    system_prompt: str,
    user_prompt: str,
    json_mode: bool,
) -> str:

    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        "stream": False,
    }

    if json_mode:
        payload["format"] = "json"

    response = httpx.post(
        f"{OLLAMA_BASE_URL}/api/chat",
        json=payload,
        timeout=120,
    )

    response.raise_for_status()

    data = response.json()

    return data["message"]["content"]


# ======================================================
# MAIN
# ======================================================

def call_llm(
    system_prompt: str,
    user_prompt: str,
    json_mode: bool = False,
) -> str:

    try:

        if LLM_PROVIDER == "groq":
            return _call_groq(
                system_prompt,
                user_prompt,
                json_mode,
            )

        elif LLM_PROVIDER == "openai":
            return _call_openai(
                system_prompt,
                user_prompt,
                json_mode,
            )

        elif LLM_PROVIDER == "ollama":
            return _call_ollama(
                system_prompt,
                user_prompt,
                json_mode,
            )

        raise LLMError(
            f"Unsupported provider: {LLM_PROVIDER}"
        )

    except Exception as e:
        raise LLMError(
            f"{LLM_PROVIDER} request failed: {e}"
        ) from e


# ======================================================
# JSON HELPER
# ======================================================

def call_llm_json(
    system_prompt: str,
    user_prompt: str,
) -> dict:

    raw = call_llm(
        system_prompt,
        user_prompt,
        json_mode=True,
    )

    try:
        return json.loads(raw)

    except json.JSONDecodeError:

        repair_prompt = f"""
The following output is invalid JSON.

Return ONLY valid JSON.

{raw}
"""

        repaired = call_llm(
            "You are a JSON repair assistant.",
            repair_prompt,
            json_mode=True,
        )

        return json.loads(repaired)