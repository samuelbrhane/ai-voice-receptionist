"use client";

import { useEffect, useState } from "react";

import { CalendarPanel } from "@/components/calendar";
import { CallCard, Transcript } from "@/components/call";
import { Hero } from "@/components/landing";
import { getSession, resetDemo, type Session } from "@/lib/api";
import { useCall } from "@/lib/call";

import { DemoBar } from "./demo-bar";
import { TryCard } from "./try-card";

export function LiveDemo() {
  const call = useCall();
  const [session, setSession] = useState<Session | null>(null);
  const [resetCount, setResetCount] = useState(0);

  // Session: the sample patient and calls left, fresh after every call and reset
  useEffect(() => {
    getSession().then(setSession).catch(() => setSession(null));
  }, [call.endedCount, resetCount]);

  const reset = async () => {
    await resetDemo();
    setResetCount((count) => count + 1);
  };

  return (
    <>
      <Hero />

      {/* Orb and conversation side by side, so both are in view during a call */}
      <section
        id="try"
        className="mx-auto grid max-w-6xl scroll-mt-6 gap-5 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
      >
        <div
          className="rise-in flex items-center justify-center rounded-2xl border border-line bg-surface py-8"
          style={{ animationDelay: "150ms" }}
        >
          <CallCard call={call} />
        </div>
        <Transcript lines={call.transcript} checking={call.toolBusy} />
      </section>

      {/* Calendar below, with what to try next to it */}
      <section className="mx-auto mt-5 grid max-w-6xl gap-5 px-4 pb-14 sm:px-6 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <div className="min-w-0">
          <CalendarPanel live={call.status === "live"} refreshKey={call.endedCount + resetCount} />
        </div>
        <div className="flex min-w-0 flex-col gap-5">
          <TryCard sample={session?.sample} />
          <DemoBar callsLeft={session?.calls_left} maxSeconds={session?.max_call_seconds} onReset={reset} />
        </div>
      </section>
    </>
  );
}