const DELAYS = ["0s", "0.15s", "0.3s", "0.45s", "0.6s"];

export function VoiceBars({ active }: { active: boolean }) {
  return (
    <span className="flex h-5 items-end gap-0.5" aria-hidden>
      {DELAYS.map((delay) => (
        <span
          key={delay}
          className={`w-1 rounded-full bg-teal ${active ? "voice-bar" : ""}`}
          style={{ height: active ? "100%" : "25%", animationDelay: delay }}
        />
      ))}
    </span>
  );
}