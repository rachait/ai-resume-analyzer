interface FilePreviewProps {
  filename: string;
  sizeBytes: number;
  onRemove: () => void;
}

export default function FilePreview({ filename, sizeBytes, onRemove }: FilePreviewProps) {
  const sizeKb = (sizeBytes / 1024).toFixed(1);

  return (
    <div className="flex items-center justify-between border border-hairline rounded-sm px-4 py-3">
      <div className="font-mono text-sm">
        <span className="text-paper">{filename}</span>
        <span className="text-mute ml-3">{sizeKb} KB</span>
      </div>
      <button
        onClick={onRemove}
        className="font-mono text-xs text-alert hover:underline"
      >
        remove
      </button>
    </div>
  );
}
