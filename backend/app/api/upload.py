from __future__ import annotations

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Query,
    HTTPException,
)

from app.parsers.document_parser import (
    extract_text,
    structure_resume,
    structure_job_description,
)
from app.utils.session_store import session_store
from app.models.schemas import UploadResponse

router = APIRouter(prefix="/api", tags=["upload"])

MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10MB


@router.post("/upload-resume", response_model=UploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()

    if len(contents) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="File too large (max 10MB)",
        )

    try:
        raw_text = extract_text(file.filename, contents)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    if not raw_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Could not extract any text from this file.",
        )

    structured = structure_resume(raw_text)

    session_id = session_store.create()

    session_store.update(
        session_id,
        resume_raw_text=raw_text,
        resume_structured=structured,
        resume_filename=file.filename,
    )

    return UploadResponse(
        session_id=session_id,
        filename=file.filename,
        word_count=len(raw_text.split()),
        preview=raw_text[:500],
    )


@router.post("/upload-jd", response_model=UploadResponse)
async def upload_jd(
    session_id: str = Query(...),
    file: UploadFile | None = File(None),
    text: str | None = Form(None),
):
    """
    Upload Job Description

    Accepts either:
    - uploaded file
    - pasted text

    session_id comes from query params.
    """

    session_store.require(session_id)

    raw_text = ""
    filename = ""

    if file is not None and file.filename:
        contents = await file.read()

        if len(contents) > MAX_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail="File too large (max 10MB)",
            )

        try:
            raw_text = extract_text(file.filename, contents)
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=str(e),
            )

        filename = file.filename

    elif text is not None and text.strip():
        raw_text = text.strip()
        filename = "pasted_job_description.txt"

    else:
        raise HTTPException(
            status_code=400,
            detail="Provide either a file upload or raw text for the job description.",
        )

    if not raw_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Job description is empty.",
        )

    structured = structure_job_description(raw_text)

    session_store.update(
        session_id,
        jd_raw_text=raw_text,
        jd_structured=structured,
        jd_filename=filename,
    )

    return UploadResponse(
        session_id=session_id,
        filename=filename,
        word_count=len(raw_text.split()),
        preview=raw_text[:500],
    )