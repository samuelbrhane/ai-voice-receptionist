const TZ = "Europe/Rome";

const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
const dayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: TZ });
const shortDayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: TZ });
const isoDayFormat = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: TZ });

/** "10:30" in clinic time. */
export function formatTime(iso: string): string {
  return timeFormat.format(new Date(iso));
}

/** "Thursday 26 November" for a YYYY-MM-DD day. */
export function formatDay(day: string): string {
  return dayFormat.format(new Date(`${day}T12:00:00Z`));
}

/** "Thu 26 Nov" for a timestamp. */
export function formatShortDay(iso: string): string {
  return shortDayFormat.format(new Date(iso));
}

/** Clinic-time YYYY-MM-DD for a timestamp. */
export function clinicDay(iso: string): string {
  return isoDayFormat.format(new Date(iso));
}

/** Today in clinic time, as YYYY-MM-DD. */
export function today(): string {
  return isoDayFormat.format(new Date());
}

/** Moves a YYYY-MM-DD day by a number of days. */
export function addDays(day: string, amount: number): string {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

/** Minutes since midnight in clinic time, for placing blocks on the day. */
export function clinicMinutes(iso: string): number {
  const [hours, minutes] = formatTime(iso).split(":").map(Number);
  return hours * 60 + minutes;
}

/** "1:05" for a call timer. */
export function formatTimer(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}