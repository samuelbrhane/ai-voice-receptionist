"use client";

import { useState } from "react";

import type { Language } from "@/lib/api";
import type { useCall } from "@/lib/call";
import { formatTimer } from "@/lib/format";

import { LanguageSwitch } from "./language-switch";
import { VoiceOrb } from "./voice-orb";

type Call = ReturnType<typeof useCall>;

function statusText(call: Call, language: Language): string {
  switch (call.status) {
    case "connecting":
      return "Connecting… allow the microphone if your browser asks.";
    case "live":
      return call.speaking ? "Sofia is speaking" : "Sofia is listening";
    case "ended":
      return "Call ended. Tap the orb to call again.";
    case "error":
      return call.error ?? "Something went wrong.";
    default:
      return language === "it" ? "Tocca per chiamare Sofia" : "Tap to call Sofia";
  }
}

export function CallCard({ call }: { call: Call }) {
  const [language, setLanguage] = useState<Language>("en");
  const busy = call.status === "connecting" || call.status === "live";

  const toggle = () => {
    if (call.status === "live") call.stop();
    else void call.start(language);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <LanguageSwitch value={language} onChange={setLanguage} disabled={busy} />
      <VoiceOrb status={call.status} volume={call.volume} onClick={toggle} />

      <p className={`min-h-6 text-center text-sm font-medium ${call.status === "error" ? "text-live" : "text-ink-soft"}`}>
        {statusText(call, language)}
      </p>

      {call.status === "live" && (
        <div className="flex items-center gap-3">
          <span className="tabular rounded-full bg-surface px-3 py-1 text-sm text-ink-soft">
            {formatTimer(call.seconds)} / {formatTimer(call.maxSeconds)}
          </span>
          <button
            type="button"
            onClick={call.stop}
            className="live-pulse rounded-full bg-live px-4 py-1.5 text-sm font-semibold text-white"
          >
            End call
          </button>
        </div>
      )}
    </div>
  );
}