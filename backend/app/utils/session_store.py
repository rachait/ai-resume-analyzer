"""
In-memory session store. Each session holds the parsed resume + JD for a
single upload/analysis flow. This keeps the MVP simple and dependency-free.

For production, swap this for Redis (ephemeral, fast) or Postgres (durable,
supports history/auth) — the interface below is intentionally small so that
swap is a drop-in change.
"""
from __future__ import annotations
import uuid
from typing import Dict, Optional


class SessionStore:
    def __init__(self):
        self._sessions: Dict[str, dict] = {}

    def create(self) -> str:
        session_id = str(uuid.uuid4())
        self._sessions[session_id] = {}
        return session_id

    def get(self, session_id: str) -> Optional[dict]:
        return self._sessions.get(session_id)

    def update(self, session_id: str, **kwargs) -> None:
        if session_id not in self._sessions:
            self._sessions[session_id] = {}
        self._sessions[session_id].update(kwargs)

    def require(self, session_id: str) -> dict:
        session = self.get(session_id)
        if session is None:
            raise KeyError(f"Unknown session_id: {session_id}")
        return session


# Single shared instance used across the app (fine for single-process dev/demo).
session_store = SessionStore()
