import { sendJson } from "./client";
import type { CallSettings, Language } from "./types";

/** Checks the demo limits and returns what the page passes to Vapi. */
export function startCall(language: Language): Promise<CallSettings> {
  return sendJson<CallSettings>("/calls/start", "POST", { language });
}

export function resetDemo(): Promise<void> {
  return sendJson<void>("/demo/reset", "POST");
}