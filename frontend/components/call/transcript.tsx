"use client";

import { useEffect, useRef } from "react";

import type { TranscriptLine } from "@/lib/call";

type Props = {
  lines: TranscriptLine[];
  checking: boolean;
};

function CheckingLine() {
  return (
    <div className="line-in flex justify-start">
      <p className="flex items-center gap-2 rounded-2xl bg-mint px-3 py-2 text-sm text-teal-deep">
        Checking the calendar
        <span className="flex gap-0.5" aria-hidden>
          {[0, 0.2, 0.4].map((delay) => (
            <span key={delay} className="typing-dot h-1.5 w-1.5 rounded-full bg-teal" style={{ animationDelay: `${delay}s` }} />
          ))}
        </span>
      </p>
    </div>
  );
}

export function Transcript({ lines, checking }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);

  // Keep the newest line in view
  useEffect(() => {
    const box = boxRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [lines, checking]);

  return (
    <section className="flex flex-col rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <h3 className="mb-3 font-display text-lg font-medium">Conversation</h3>
      {lines.length === 0 ? (
        <p className="rounded-xl bg-porcelain px-4 py-10 text-center text-sm text-ink-soft">
          What you and Sofia say appears here, live.
        </p>
      ) : (
        <div ref={boxRef} className="max-h-96 space-y-3 overflow-y-auto rounded-xl bg-porcelain p-4" aria-live="polite">
          {lines.map((line) => (
            <div key={line.id} className={`line-in flex ${line.speaker === "user" ? "justify-end" : "justify-start"}`}>
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
          {checking && <CheckingLine />}
        </div>
      )}
    </section>
  );
}