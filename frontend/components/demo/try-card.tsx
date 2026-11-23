import type { SamplePatient } from "@/lib/api";
import { formatShortDay, formatTime } from "@/lib/format";

const IDEAS = [
  "“I'd like to book a cleaning next week.”",
  "“I broke a tooth and it really hurts.”",
  "“Can Dr. Ferri do a whitening?”",
  "“Vorrei prenotare una visita di controllo.”",
];

export function TryCard({ sample }: { sample: SamplePatient | null | undefined }) {
  return (
    <section className="rounded-2xl border border-line bg-mint p-4 sm:p-5">
      <h3 className="font-display text-lg font-medium">Things to try</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {IDEAS.map((idea) => (
          <li key={idea}>{idea}</li>
        ))}
      </ul>

      {sample && (
        <div className="mt-4 rounded-xl bg-surface p-3 text-sm">
          <p className="font-semibold">Move or cancel an existing booking</p>
          <p className="mt-1 text-ink-soft">
            Say you are <strong className="text-ink">{sample.name}</strong>, phone{" "}
            <strong className="tabular text-ink">{sample.phone}</strong>. She has a{" "}
            {sample.treatment_name.toLowerCase()} on{" "}
            <span className="tabular">
              {formatShortDay(sample.starts_at)} at {formatTime(sample.starts_at)}
            </span>
            .
          </p>
        </div>
      )}
    </section>
  );
}