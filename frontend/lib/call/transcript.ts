export type Speaker = "assistant" | "user";

export type TranscriptLine = {
  id: number;
  speaker: Speaker;
  text: string;
  final: boolean;
};

export type TranscriptEvent = {
  role: Speaker;
  text: string;
  final: boolean;
};

let nextId = 1;

/** Adds a transcript event: updates the speaker's open line, or starts a new one. */
export function addToTranscript(lines: TranscriptLine[], event: TranscriptEvent): TranscriptLine[] {
  const last = lines.at(-1);
  if (last && last.speaker === event.role && !last.final) {
    return [...lines.slice(0, -1), { ...last, text: event.text, final: event.final }];
  }
  return [...lines, { id: nextId++, speaker: event.role, text: event.text, final: event.final }];
}