"use client";

import { useEffect, useRef, useState } from "react";

import { addDays, clinicDay, formatDay } from "@/lib/format";

import { DayColumns } from "./day-columns";
import { DaySkeleton } from "./day-skeleton";
import { RecentChanges } from "./recent-changes";
import { useCalendar } from "./use-calendar";

type Props = {
  live: boolean;
  refreshKey: number;
};

export function CalendarPanel({ live, refreshKey }: Props) {
  // No day picked yet means "today", as the backend sees it in clinic time
  const [day, setDay] = useState<string | null>(null);
  const { data, error, reload } = useCalendar(day, live);
  const lastChange = useRef<string | null>(null);
  const shown = day ?? data?.date ?? null;

  // Reload after a call ends or the demo is reset
  useEffect(() => {
    reload();
  }, [refreshKey, reload]);

  // While live, jump to the day of the agent's newest change
  useEffect(() => {
    const newest = data?.recent[0];
    if (!newest) return;
    if (live && lastChange.current && newest.updated_at !== lastChange.current) {
      setDay(clinicDay(newest.starts_at));
    }
    lastChange.current = newest.updated_at;
  }, [data, live]);

  const move = (amount: number) => {
    if (shown) setDay(addDays(shown, amount));
  };

  // Show the skeleton until the requested day has arrived
  const loading = !data || (day !== null && data.date !== day);

  return (
    <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={!data || !shown || shown <= data.today}
          className="rounded-full border border-line px-3 py-1 text-sm disabled:opacity-40"
          aria-label="Previous day"
        >
          ←
        </button>
        <h3 className="text-center font-display text-lg font-medium">{shown ? formatDay(shown) : "Today"}</h3>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={!shown}
          className="rounded-full border border-line px-3 py-1 text-sm disabled:opacity-40"
          aria-label="Next day"
        >
          →
        </button>
      </div>

      {error && <p className="mb-2 text-sm text-live">{error}</p>}
      {loading ? <DaySkeleton /> : <DayColumns day={data} />}

      <div className="mt-5 border-t border-line pt-4">
        <h4 className="mb-2 text-sm font-semibold">What Sofia just did</h4>
        <RecentChanges items={data?.recent ?? []} onOpenDay={setDay} />
      </div>
    </section>
  );
}