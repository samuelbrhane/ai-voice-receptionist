"use client";

import Vapi from "@vapi-ai/web";
import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError, startCall, type Language } from "@/lib/api";

import { addToTranscript, type Speaker, type TranscriptLine } from "./transcript";

export type CallStatus = "idle" | "connecting" | "live" | "ended" | "error";

const ASSISTANTS: Record<Language, string | undefined> = {
  en: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_EN,
  it: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_IT,
};

type VapiMessage = {
  type?: string;
  role?: Speaker;
  transcriptType?: "partial" | "final";
  transcript?: string;
};

export function useCall() {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [language, setLanguage] = useState<Language | null>(null);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [maxSeconds, setMaxSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // One Vapi client for the page, created in the browser only
  const getVapi = useCallback(() => {
    if (vapiRef.current) return vapiRef.current;
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "");
    vapi.on("call-start", () => setStatus("live"));
    vapi.on("call-end", () => {
      setStatus("ended");
      setSpeaking(false);
    });
    vapi.on("speech-start", () => setSpeaking(true));
    vapi.on("speech-end", () => setSpeaking(false));
    vapi.on("message", (message: VapiMessage) => {
      if (message.type !== "transcript" || !message.role || !message.transcript) return;
      setTranscript((lines) =>
        addToTranscript(lines, {
          role: message.role!,
          text: message.transcript!,
          final: message.transcriptType === "final",
        }),
      );
    });
    vapi.on("error", () => {
      setStatus("error");
      setError("The call could not continue. Please try again.");
    });
    vapiRef.current = vapi;
    return vapi;
  }, []);

  // Call timer
  useEffect(() => {
    if (status !== "live") return;
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Hang up if the visitor leaves the page mid-call
  useEffect(() => () => void vapiRef.current?.stop(), []);

  const start = useCallback(
    async (lang: Language) => {
      const assistantId = ASSISTANTS[lang];
      if (!assistantId) {
        setStatus("error");
        setError("This call option is not set up yet.");
        return;
      }
      setStatus("connecting");
      setLanguage(lang);
      setTranscript([]);
      setSeconds(0);
      setError(null);
      try {
        // The backend checks the demo limits before any Vapi minutes are used
        const settings = await startCall(lang);
        setMaxSeconds(settings.max_call_seconds);
        const visitor = { visitorId: settings.visitor_id };
        await getVapi().start(assistantId, {
          metadata: visitor,
          variableValues: visitor,
          maxDurationSeconds: settings.max_call_seconds,
        });
      } catch (caught) {
        setStatus("error");
        setError(
          caught instanceof ApiError
            ? caught.message
            : "Could not start the call. Check that the microphone is allowed.",
        );
      }
    },
    [getVapi],
  );

  const stop = useCallback(() => {
    vapiRef.current?.stop();
  }, []);

  return { status, language, transcript, speaking, seconds, maxSeconds, error, start, stop };
}