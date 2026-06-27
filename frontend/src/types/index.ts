export interface UploadResponse {
  session_id: string;
  filename: string;
  word_count: number;
  preview: string;
}

export interface KeywordAnalysis {
  matched: string[];
  missing: string[];
  all_jd_keywords: string[];
}

export interface ATSBreakdown {
  skills_match: number;
  section_completeness: number;
  formatting: number;
  experience_relevance: number;
}

export interface ATSResult {
  overall_ats_score: number;
  breakdown: ATSBreakdown;
}

export interface SemanticDetail {
  jd_requirement: string;
  best_matching_resume_line: string;
  similarity: number;
}

export interface SemanticResult {
  overall_semantic_score: number;
  details: SemanticDetail[];
}

export interface FullAnalysisResponse {
  session_id: string;
  ats: ATSResult;
  semantic: SemanticResult;
  keywords: KeywordAnalysis;
}

export interface ReviewResult {
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface BulletRewrite {
  original: string;
  rewritten: string;
}

export interface CoverLetterResult {
  cover_letter: string;
}

export interface InterviewTopic {
  topic: string;
  questions: string[];
}

export interface InterviewQuestionsResult {
  topics: InterviewTopic[];
}
