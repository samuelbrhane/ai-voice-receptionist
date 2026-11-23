"use client";

import { useEffect, useRef } from "react";

import type { TranscriptLine } from "@/lib/call";

export function Transcript({ lines }: { lines: TranscriptLine[] }) {
  const boxRef = useRef<HTMLDivElement>(null);

  // Keep the newest line in view
  useEffect(() => {
    const box = boxRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [lines]);

  if (lines.length === 0) {
    return (
      <p className="rounded-xl bg-porcelain px-4 py-10 text-center text-sm text-ink-soft">
        The conversation appears here while you talk.
      </p>
    );
  }

  return (
    <div ref={boxRef} className="max-h-80 space-y-3 overflow-y-auto rounded-xl bg-porcelain p-4" aria-live="polite">
      {lines.map((line) => (
        <div key={line.id} className={line.speaker === "user" ? "flex justify-end" : "flex justify-start"}>
          <p
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              line.speaker === "user" ? "bg-teal text-white" : "bg-surface text-ink"
            } ${line.final ? "" : "opacity-70"}`}
          >
            <span className="mb-0.5 block text-[11px] font-semibold opacity-80">
              {line.speaker === "user" ? "You" : "Sofia"}
            </span>
            {line.text}
          </p>
        </div>
      ))}
    </div>
  );
}