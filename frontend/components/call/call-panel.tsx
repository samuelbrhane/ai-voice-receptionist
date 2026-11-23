"use client";

import type { Language } from "@/lib/api";
import type { useCall } from "@/lib/call";
import { formatTimer } from "@/lib/format";

import { Transcript } from "./transcript";
import { VoiceBars } from "./voice-bars";

type Call = ReturnType<typeof useCall>;

const BUTTONS: { language: Language; label: string; hint: string }[] = [
  { language: "en", label: "Call in English", hint: "Sofia answers in English" },
  { language: "it", label: "Chiama in italiano", hint: "Sofia risponde in italiano" },
];

function statusText(call: Call): string {
  switch (call.status) {
    case "connecting":
      return "Connecting… allow the microphone if your browser asks.";
    case "live":
      return `On call · ${formatTimer(call.seconds)} of ${formatTimer(call.maxSeconds)}`;
    case "ended":
      return "Call ended. The calendar shows what changed.";
    case "error":
      return call.error ?? "Something went wrong.";
    default:
      return "Choose a language to call the clinic.";
  }
}

export function CallPanel({ call }: { call: Call }) {
  const busy = call.status === "connecting" || call.status === "live";

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {BUTTONS.map((button) => (
          <button
            key={button.language}
            type="button"
            disabled={busy}
            onClick={() => void call.start(button.language)}
            className="rounded-xl bg-teal px-4 py-3 text-left text-white transition hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="block font-semibold">{button.label}</span>
            <span className="block text-sm opacity-85">{button.hint}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3">
        <div className="flex items-center gap-3">
          {call.status === "live" && <VoiceBars active={call.speaking} />}
          <p className={`tabular text-sm ${call.status === "error" ? "text-live" : "text-ink-soft"}`}>
            {statusText(call)}
          </p>
        </div>
        {busy && (
          <button
            type="button"
            onClick={call.stop}
            className="live-pulse shrink-0 rounded-full bg-live px-4 py-2 text-sm font-semibold text-white"
          >
            End call
          </button>
        )}
      </div>

      <Transcript lines={call.transcript} />
    </section>
  );
}