"use client";

import { useEffect, useRef } from "react";

import type { TranscriptLine } from "@/lib/call";

type Props = {
  lines: TranscriptLine[];
  checking: boolean;
};

const EXAMPLE: { speaker: "assistant" | "user"; text: string }[] = [
  { speaker: "assistant", text: "Hello, this is Sofia from Aurelia Dental. How can I help you today?" },
  { speaker: "user", text: "Hi, I'd like to book a cleaning next week." },
  { speaker: "assistant", text: "Of course. I have Tuesday at ten thirty with Dr. Ferri, or Wednesday at two. Which suits you?" },
];

function Bubble({ speaker, text, faded }: { speaker: "assistant" | "user"; text: string; faded: boolean }) {
  return (
    <div className={`flex ${speaker === "user" ? "justify-end" : "justify-start"}`}>
      <p
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
          speaker === "user" ? "bg-teal text-white" : "bg-surface text-ink"
        } ${faded ? "opacity-70" : ""}`}
      >
        <span className="mb-0.5 block text-[11px] font-semibold opacity-80">{speaker === "user" ? "You" : "Sofia"}</span>
        {text}
      </p>
    </div>
  );
}

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

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-porcelain p-4">
      <div className="space-y-3 opacity-45" aria-hidden>
        {EXAMPLE.map((line) => (
          <Bubble key={line.text} speaker={line.speaker} text={line.text} faded={false} />
        ))}
      </div>
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-porcelain via-porcelain/70 to-transparent">
        <p className="mt-16 rounded-full bg-surface px-4 py-2 text-sm font-medium text-teal-deep shadow-sm">
          Tap the orb above to start your own call
        </p>
      </div>
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
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-medium">Conversation</h3>
        {lines.length === 0 && <span className="text-xs font-medium text-ink-soft">Example</span>}
      </div>
      {lines.length === 0 ? (
        <EmptyState />
      ) : (
        <div ref={boxRef} className="max-h-96 space-y-3 overflow-y-auto rounded-xl bg-porcelain p-4" aria-live="polite">
          {lines.map((line) => (
            <div key={line.id} className="line-in">
              <Bubble speaker={line.speaker} text={line.text} faded={!line.final} />
            </div>
          ))}
          {checking && <CheckingLine />}
        </div>
      )}
    </section>
  );
}