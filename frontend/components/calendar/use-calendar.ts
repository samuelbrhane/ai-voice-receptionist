"use client";

import { useCallback, useEffect, useState } from "react";

import { getCalendar, type CalendarDay } from "@/lib/api";

const LIVE_REFRESH_MS = 2500;

/** Loads one day, and refreshes it every few seconds while a call is live. */
export function useCalendar(day: string, live: boolean) {
  const [data, setData] = useState<CalendarDay | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await getCalendar(day));
      setError(null);
    } catch {
      setError("Could not load the calendar.");
    }
  }, [day]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!live) return;
    const timer = setInterval(() => void load(), LIVE_REFRESH_MS);
    return () => clearInterval(timer);
  }, [live, load]);

  return { data, error, reload: load };
}