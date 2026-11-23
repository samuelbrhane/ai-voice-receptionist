import type { CalendarAppointment, CalendarDay } from "@/lib/api";
import { clinicMinutes } from "@/lib/format";

import { AppointmentBlock } from "./appointment-block";

const PX_PER_MINUTE = 1.1;

const DENTISTS = [
  { key: "ferri", name: "Dr. Ferri" },
  { key: "vitale", name: "Dr. Vitale" },
] as const;

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function DayColumns({ day }: { day: CalendarDay }) {
  if (!day.is_open || !day.opens_at || !day.closes_at) {
    return <p className="py-16 text-center text-ink-soft">The clinic is closed on this day.</p>;
  }

  const opens = toMinutes(day.opens_at);
  const closes = toMinutes(day.closes_at);
  const height = (closes - opens) * PX_PER_MINUTE;
  const hours = Array.from({ length: (closes - opens) / 60 + 1 }, (_, i) => opens / 60 + i);

  const place = (appointment: CalendarAppointment) => ({
    top: (clinicMinutes(appointment.starts_at) - opens) * PX_PER_MINUTE,
    height: (clinicMinutes(appointment.ends_at) - clinicMinutes(appointment.starts_at)) * PX_PER_MINUTE - 2,
  });

  return (
    <div className="grid grid-cols-[2.5rem_1fr_1fr] gap-x-2">
      <div />
      {DENTISTS.map((dentist) => (
        <p key={dentist.key} className="pb-2 text-center text-sm font-semibold">
          {dentist.name}
        </p>
      ))}

      <div className="relative" style={{ height }}>
        {hours.map((hour) => (
          <span
            key={hour}
            className="tabular absolute -translate-y-1/2 text-[11px] text-ink-soft"
            style={{ top: (hour * 60 - opens) * PX_PER_MINUTE }}
          >
            {hour}:00
          </span>
        ))}
      </div>

      {DENTISTS.map((dentist) => (
        <div key={dentist.key} className="relative rounded-lg bg-porcelain" style={{ height }}>
          {hours.map((hour) => (
            <div
              key={hour}
              className="absolute inset-x-0 border-t border-line"
              style={{ top: (hour * 60 - opens) * PX_PER_MINUTE }}
            />
          ))}
          {day.appointments
            .filter((appointment) => appointment.dentist === dentist.key)
            .map((appointment) => (
              <AppointmentBlock key={appointment.id} appointment={appointment} {...place(appointment)} />
            ))}
        </div>
      ))}
    </div>
  );
}