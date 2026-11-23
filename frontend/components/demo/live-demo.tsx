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
      <Hero>
        <CallCard call={call} />
      </Hero>

      <section id="try" className="mx-auto grid max-w-6xl scroll-mt-6 gap-5 px-4 pb-14 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <Transcript lines={call.transcript} checking={call.toolBusy} />
          <TryCard sample={session?.sample} />
          <DemoBar callsLeft={session?.calls_left} maxSeconds={session?.max_call_seconds} onReset={reset} />
        </div>
        <div className="min-w-0">
          <CalendarPanel live={call.status === "live"} refreshKey={call.endedCount + resetCount} />
        </div>
      </section>
    </>
  );
}