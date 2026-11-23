"use client";

import { useState } from "react";

type Props = {
  callsLeft: number | null | undefined;
  maxSeconds: number | undefined;
  onReset: () => Promise<void>;
};

export function DemoBar({ callsLeft, maxSeconds, onReset }: Props) {
  const [resetting, setResetting] = useState(false);

  const reset = async () => {
    setResetting(true);
    try {
      await onReset();
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
      <p>
        {callsLeft === null || callsLeft === undefined
          ? "Unlimited calls in local development."
          : `${callsLeft} demo ${callsLeft === 1 ? "call" : "calls"} left today`}
        {maxSeconds ? ` · up to ${Math.round(maxSeconds / 60)} minutes each` : ""}
      </p>
      <button
        type="button"
        onClick={() => void reset()}
        disabled={resetting}
        className="rounded-full border border-line bg-surface px-3 py-1 hover:border-teal disabled:opacity-50"
      >
        {resetting ? "Resetting…" : "Reset calendar"}
      </button>
    </div>
  );
}