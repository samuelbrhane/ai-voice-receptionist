"use client";

import { useCallback, useEffect, useState } from "react";

import { getCalendar, type CalendarDay } from "@/lib/api";

const LIVE_REFRESH_MS = 2500;

/** Loads one day, and refreshes it every few seconds while a call is live. */
export function useCalendar(day: string, live: boolean) {
  const [data, setData] = useState<CalendarDay | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  // Fetch whenever the day changes or a reload is asked for
  useEffect(() => {
    let current = true;
    getCalendar(day)
      .then((result) => {
        if (!current) return;
        setData(result);
        setError(null);
      })
      .catch(() => {
        if (current) setError("Could not load the calendar.");
      });
    return () => {
      current = false;
    };
  }, [day, version]);

  // Poll while a call is live
  useEffect(() => {
    if (!live) return;
    const timer = setInterval(() => setVersion((value) => value + 1), LIVE_REFRESH_MS);
    return () => clearInterval(timer);
  }, [live]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  return { data, error, reload };
}