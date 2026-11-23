"use client";

import { useEffect, useState } from "react";

import { CalendarPanel } from "@/components/calendar";
import { CallPanel } from "@/components/call";
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
    <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="flex min-w-0 flex-col gap-5">
        <CallPanel call={call} />
        <TryCard sample={session?.sample} />
        <DemoBar callsLeft={session?.calls_left} maxSeconds={session?.max_call_seconds} onReset={reset} />
      </div>
      <div className="min-w-0">
        <CalendarPanel live={call.status === "live"} refreshKey={call.endedCount + resetCount} />
      </div>
    </div>
  );
}