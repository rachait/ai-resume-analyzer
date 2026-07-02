import { useState } from "react";
import DragDrop from "./DragDrop";
import FilePreview from "./FilePreview";
import Button from "../common/Button";
import Spinner from "../common/Spinner";

interface UploadCardProps {
  onSubmit: (file: File, jobDescription: string) => Promise<void>;
}

export default function UploadCard({ onSubmit }: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!file) {
      setError("Add a resume file first.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Paste the job description you're targeting.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSubmit(file, jobDescription);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-8 py-12 space-y-6">
      <h2 className="text-2xl text-paper">Upload your resume</h2>

      {file ? (
        <FilePreview filename={file.name} sizeBytes={file.size} onRemove={() => setFile(null)} />
      ) : (
        <DragDrop onFileSelected={setFile} />
      )}

      <div>
        <label className="font-mono text-xs tracking-widest text-mute block mb-2">
          JOB DESCRIPTION
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          placeholder="Paste the job description here..."
          className="w-full bg-ink-900 border border-hairline rounded-sm p-3 text-sm text-paper placeholder:text-mute resize-none"
        />
      </div>

      {error && <p className="text-sm text-alert font-mono">{error}</p>}

      <Button onClick={handleSubmit} disabled={loading} className="w-full flex items-center justify-center gap-2">
        {loading ? <Spinner /> : "Analyze resume"}
      </Button>
    </div>
  );
}
