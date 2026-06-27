import axios from "axios";
import type {
  UploadResponse,
  FullAnalysisResponse,
  ReviewResult,
  CoverLetterResult,
  InterviewQuestionsResult,
} from "../types";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_BASE,
});

export async function uploadResume(
  file: File
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await client.post(
    "/upload-resume",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function uploadJobDescription(
  sessionId: string,
  fileOrText: File | string
): Promise<UploadResponse> {
  const formData = new FormData();

  if (typeof fileOrText === "string") {
    formData.append("text", fileOrText);
  } else {
    formData.append("file", fileOrText);
  }

  const { data } = await client.post(
    `/upload-jd?session_id=${encodeURIComponent(sessionId)}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function runFullAnalysis(
  sessionId: string
): Promise<FullAnalysisResponse> {
  const { data } = await client.post("/analyze", {
    session_id: sessionId,
  });

  return data;
}

export async function getReview(
  sessionId: string
): Promise<ReviewResult> {
  const { data } = await client.post("/review", {
    session_id: sessionId,
  });

  return data;
}

export async function getCoverLetter(
  sessionId: string
): Promise<CoverLetterResult> {
  const { data } = await client.post("/cover-letter", {
    session_id: sessionId,
  });

  return data;
}

export async function getInterviewQuestions(
  sessionId: string
): Promise<InterviewQuestionsResult> {
  const { data } = await client.post(
    "/interview-questions",
    {
      session_id: sessionId,
    }
  );

  return data;
}

export async function rewriteBullets(
  sessionId: string,
  bullets: string[]
) {
  const { data } = await client.post(
    "/rewrite-bullets",
    {
      session_id: sessionId,
      bullets,
    }
  );

  return data;
}