export default function Spinner() {
  return (
    <div
      className="w-5 h-5 border-2 border-hairline border-t-signal rounded-full animate-spin"
      role="status"
      aria-label="Loading"
    />
  );
}
