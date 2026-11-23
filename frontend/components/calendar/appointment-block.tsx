import type { CalendarAppointment } from "@/lib/api";
import { formatTime } from "@/lib/format";

type Props = {
  appointment: CalendarAppointment;
  top: number;
  height: number;
};

export function AppointmentBlock({ appointment, top, height }: Props) {
  const byAgent = appointment.changed_by_agent;
  return (
    <div
      className={`absolute inset-x-1 overflow-hidden rounded-md border px-2 py-1 text-xs ${
        byAgent
          ? "just-changed border-teal bg-mint text-ink shadow-sm"
          : "border-line bg-surface text-ink-soft"
      }`}
      style={{ top, height }}
      title={`${appointment.patient_name} · ${appointment.treatment_name}`}
    >
      <p className="tabular font-medium text-ink">
        {formatTime(appointment.starts_at)} {appointment.treatment_name}
      </p>
      {height >= 34 && <p className="truncate">{appointment.patient_name}</p>}
      {byAgent && height >= 50 && <p className="font-medium text-teal">Booked by Sofia</p>}
    </div>
  );
}