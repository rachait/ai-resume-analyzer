import { useState, KeyboardEvent } from "react";

interface PromptInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function PromptInput({ onSend, disabled }: PromptInputProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="flex gap-2 border-t border-hairline px-6 py-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask about your resume..."
        className="flex-1 bg-ink-900 border border-hairline rounded-sm px-4 py-2.5 text-sm text-paper placeholder:text-mute"
      />
      <button
        onClick={submit}
        disabled={disabled}
        className="px-5 py-2.5 bg-paper text-ink-950 rounded-sm text-sm font-medium hover:bg-paper-dim transition-colors disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}
