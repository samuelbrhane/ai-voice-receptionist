"use client";

import type { CallStatus } from "@/lib/call";

type Props = {
  status: CallStatus;
  volume: number;
  onClick: () => void;
};

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="white" strokeWidth="1.8" aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" strokeLinecap="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2.5" fill="white" />
    </svg>
  );
}

export function VoiceOrb({ status, volume, onClick }: Props) {
  const live = status === "live";
  const connecting = status === "connecting";
  // Rings grow with Sofia's voice; a small floor keeps them visible while she listens
  const level = live ? Math.min(1, volume * 1.8) : 0;

  return (
    <div className="relative grid h-64 w-64 place-items-center sm:h-72 sm:w-72">
      {[1.0, 0.75, 0.5].map((weight, index) => (
        <span
          key={weight}
          className="orb-ring absolute inset-0 rounded-full"
          style={{
            transform: `scale(${0.62 + index * 0.12 + level * weight * 0.35})`,
            opacity: live ? 0.55 + level * 0.45 : 0.45,
          }}
          aria-hidden
        />
      ))}

      {connecting && (
        <span
          className="orb-spin absolute inset-[18%] rounded-full border-[3px] border-aqua border-t-transparent"
          aria-hidden
        />
      )}

      <button
        type="button"
        onClick={onClick}
        disabled={connecting}
        aria-label={live ? "End the call" : "Start the call"}
        className={`orb-core relative grid h-36 w-36 place-items-center rounded-full transition-transform duration-150 hover:scale-105 disabled:cursor-wait sm:h-40 sm:w-40 ${
          status === "idle" || status === "ended" ? "orb-breathe" : ""
        }`}
      >
        {live ? <StopIcon /> : <MicIcon />}
      </button>
    </div>
  );
}