import { request } from "./client";
import type { CalendarDay } from "./types";

/** One day of the calendar; today when no date is given. Date is YYYY-MM-DD. */
export function getCalendar(date?: string): Promise<CalendarDay> {
  return request<CalendarDay>(date ? `/calendar?date=${date}` : "/calendar");
}