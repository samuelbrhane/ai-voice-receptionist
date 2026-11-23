import type { CalendarAppointment } from "@/lib/api";
import { clinicDay, formatShortDay, formatTime } from "@/lib/format";

function action(appointment: CalendarAppointment): string {
  if (appointment.status === "cancelled") return "Cancelled";
  if (appointment.booked_by === "agent") return "Booked";
  return "Moved";
}

type Props = {
  items: CalendarAppointment[];
  onOpenDay: (day: string) => void;
};

export function RecentChanges({ items, onOpenDay }: Props) {
  if (items.length === 0) {
    return <p className="text-sm text-ink-soft">Nothing yet. Bookings and changes from your calls appear here.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onOpenDay(clinicDay(item.starts_at))}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-left text-sm hover:border-teal"
          >
            <span className={item.status === "cancelled" ? "font-semibold text-live" : "font-semibold text-teal"}>
              {action(item)}
            </span>{" "}
            {item.treatment_name} for {item.patient_name}
            <span className="tabular block text-ink-soft">
              {formatShortDay(item.starts_at)}, {formatTime(item.starts_at)} · {item.dentist_name}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}