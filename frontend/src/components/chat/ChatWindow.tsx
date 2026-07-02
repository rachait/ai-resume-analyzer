import { useEffect, useRef } from "react";
import Message from "./Message";
import PromptInput from "./PromptInput";

export interface ChatMessageItem {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: ChatMessageItem[];
  onSend: (message: string) => void;
  loading?: boolean;
}

export default function ChatWindow({ messages, onSend, loading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[70vh] max-w-2xl mx-auto border border-hairline rounded-sm">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-mute font-mono">
            Ask anything about your resume or how to improve your match score.
          </p>
        )}
        {messages.map((m, i) => (
          <Message key={i} role={m.role} content={m.content} />
        ))}
        {loading && <p className="text-sm text-mute font-mono">Thinking...</p>}
        <div ref={bottomRef} />
      </div>
      <PromptInput onSend={onSend} disabled={loading} />
    </div>
  );
}
