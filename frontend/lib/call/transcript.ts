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

type Line = TranscriptLine & { done: string };

let nextId = 1;

/**
 * One bubble per turn: finished pieces from the same speaker are joined,
 * and the piece still being spoken is shown after them.
 */
export function addToTranscript(lines: TranscriptLine[], event: TranscriptEvent): TranscriptLine[] {
  const last = lines.at(-1) as Line | undefined;

  if (last && last.speaker === event.role) {
    const done = last.done ?? (last.final ? last.text : "");
    const joined = event.final ? [done, event.text].filter(Boolean).join(" ") : done;
    const line: Line = {
      ...last,
      done: joined,
      text: event.final ? joined : [done, event.text].filter(Boolean).join(" "),
      final: event.final,
    };
    return [...lines.slice(0, -1), line];
  }

  const line: Line = {
    id: nextId++,
    speaker: event.role,
    text: event.text,
    final: event.final,
    done: event.final ? event.text : "",
  };
  return [...lines, line];
}