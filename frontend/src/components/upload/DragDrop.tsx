import { useCallback, useState, DragEvent } from "react";

interface DragDropProps {
  onFileSelected: (file: File) => void;
}

export default function DragDrop({ onFileSelected }: DragDropProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border rounded-sm p-12 text-center transition-colors ${
        isDragging ? "border-signal bg-signal-soft" : "border-hairline"
      }`}
    >
      <p className="font-mono text-sm text-mute mb-4">
        Drag a PDF or DOCX here, or
      </p>
      <label className="inline-block px-5 py-2.5 bg-paper text-ink-950 rounded-sm text-sm font-medium cursor-pointer hover:bg-paper-dim transition-colors">
        Choose file
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleInputChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
