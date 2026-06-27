"""
Provider-agnostic LLM client. Swap between OpenAI and Ollama via .env
without changing any calling code.
"""
from __future__ import annotations
import os
import json
import httpx
from openai import OpenAI

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")


class LLMError(Exception):
    pass


def _call_openai(system_prompt: str, user_prompt: str, json_mode: bool) -> str:
    client = OpenAI()  # reads OPENAI_API_KEY from env
    kwargs = {}
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}
    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.4,
        **kwargs,
    )
    return response.choices[0].message.content


def _call_ollama(system_prompt: str, user_prompt: str, json_mode: bool) -> str:
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "stream": False,
    }
    if json_mode:
        payload["format"] = "json"

    resp = httpx.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload, timeout=120)
    resp.raise_for_status()
    data = resp.json()
    return data["message"]["content"]


def call_llm(system_prompt: str, user_prompt: str, json_mode: bool = False) -> str:
    try:
        if LLM_PROVIDER == "ollama":
            return _call_ollama(system_prompt, user_prompt, json_mode)
        return _call_openai(system_prompt, user_prompt, json_mode)
    except Exception as e:
        raise LLMError(f"LLM call failed ({LLM_PROVIDER}): {e}") from e


def call_llm_json(system_prompt: str, user_prompt: str) -> dict:
    """
    Calls the LLM expecting JSON back. Includes one retry-with-repair-prompt
    pass since local models (Ollama) are less reliable at strict JSON than
    hosted APIs.
    """
    raw = call_llm(system_prompt, user_prompt, json_mode=True)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        repair_prompt = (
            f"The following text was supposed to be valid JSON but failed to parse. "
            f"Return ONLY corrected valid JSON, no commentary:\n\n{raw}"
        )
        repaired = call_llm(
            "You fix malformed JSON. Output only valid JSON.", repair_prompt, json_mode=True
        )
        return json.loads(repaired)
