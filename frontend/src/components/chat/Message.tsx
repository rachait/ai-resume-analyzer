interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function Message({ role, content }: MessageProps) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-sm px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-paper text-ink-950"
            : "bg-ink-900 border border-hairline text-paper"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
