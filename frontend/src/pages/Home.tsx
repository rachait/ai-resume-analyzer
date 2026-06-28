import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { uploadResume, uploadJobDescription } from "../services/api";

function FileDrop({
  label,
  accept,
  onFile,
  fileName,
}: {
  label: string;
  accept: Record<string, string[]>;
  onFile: (file: File) => void;
  fileName: string | null;
}) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, maxFiles: 1 });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors cursor-pointer
        ${isDragActive ? "border-amber-400 bg-ink-800" : "border-ink-700 bg-ink-900"}`}
    >
      <input {...getInputProps()} />
      <p className="font-mono text-xs uppercase tracking-widest text-amber-400 mb-2">{label}</p>
      {fileName ? (
        <p className="text-paper-50 font-medium">{fileName}</p>
      ) : (
        <p className="text-paper-100/60 text-sm text-center">
          Drag & drop, or click to browse
          <br />
          <span className="text-xs">PDF or DOCX</span>
        </p>
      )}
    </div>
  );
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [jdMode, setJdMode] = useState<"file" | "text">("text");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  };

  async function handleAnalyze() {
    setError(null);
    if (!resumeFile) {
      setError("Please upload your resume first.");
      return;
    }
    if (jdMode === "file" && !jdFile) {
      setError("Please upload a job description file, or switch to pasting text.");
      return;
    }
    if (jdMode === "text" && !jdText.trim()) {
      setError("Please paste the job description text, or switch to file upload.");
      return;
    }

    setLoading(true);
    try {
      const resumeRes = await uploadResume(resumeFile);
      await uploadJobDescription(resumeRes.session_id, jdMode === "file" ? jdFile! : jdText);
      navigate(`/dashboard/${resumeRes.session_id}`);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong during upload. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 text-paper-50 font-body">
      <header className="border-b border-ink-800 px-8 py-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Resume <span className="text-amber-400">Scanner</span>
        </h1>
        <p className="text-paper-100/50 text-sm mt-1 font-mono">
          ats score · semantic match · keyword gaps · ai review
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="grid gap-6">
          <FileDrop
            label="01 — Your Resume"
            accept={accept}
            onFile={setResumeFile}
            fileName={resumeFile?.name ?? null}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
                02 — Target Job Description
              </p>
              <div className="flex gap-2 text-xs font-mono">
                <button
                  onClick={() => setJdMode("text")}
                  className={`px-3 py-1 rounded ${jdMode === "text" ? "bg-amber-400 text-ink-950" : "bg-ink-800 text-paper-100/60"}`}
                >
                  Paste text
                </button>
                <button
                  onClick={() => setJdMode("file")}
                  className={`px-3 py-1 rounded ${jdMode === "file" ? "bg-amber-400 text-ink-950" : "bg-ink-800 text-paper-100/60"}`}
                >
                  Upload file
                </button>
              </div>
            </div>

            {jdMode === "text" ? (
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job posting here..."
                rows={8}
                className="w-full rounded-lg bg-ink-900 border border-ink-700 p-4 text-sm text-paper-50 placeholder:text-paper-100/30 focus:outline-none focus:border-amber-400"
              />
            ) : (
              <FileDrop label="Job Description File" accept={accept} onFile={setJdFile} fileName={jdFile?.name ?? null} />
            )}
          </div>

          {error && (
            <p className="text-signal-red text-sm bg-signal-red/10 border border-signal-red/30 rounded p-3">
              {error}
            </p>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-ink-950 font-semibold rounded-lg py-3 transition-colors"
          >
            {loading ? "Scanning…" : "Analyze Resume"}
          </button>
        </div>
      </main>
    </div>
  );
}
