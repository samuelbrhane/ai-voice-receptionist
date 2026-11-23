import uuid
from dataclasses import dataclass
from datetime import date, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.clinic import TREATMENTS
from app.models import Appointment, AppointmentStatus, Dentist, Treatment
from app.services.calendar.errors import CalendarError
from app.services.calendar.times import day_bounds, last_bookable_day, now, start_times

# Suggested times are spread out, so the caller gets real choices
SUGGESTION_GAP = timedelta(minutes=90)

Busy = dict[Dentist, list[tuple[datetime, datetime]]]


@dataclass
class Slot:
    dentist: Dentist
    starts_at: datetime
    ends_at: datetime


def busy_periods(
    db: Session,
    visitor_id: uuid.UUID,
    start: datetime,
    end: datetime,
    exclude_id: uuid.UUID | None = None,
) -> Busy:
    """Booked periods per dentist that overlap the given range."""
    query = select(Appointment).where(
        Appointment.visitor_id == visitor_id,
        Appointment.status == AppointmentStatus.BOOKED,
        Appointment.starts_at < end,
        Appointment.ends_at > start,
    )
    if exclude_id is not None:
        query = query.where(Appointment.id != exclude_id)

    busy: Busy = {dentist: [] for dentist in Dentist}
    for appointment in db.scalars(query):
        busy[appointment.dentist].append((appointment.starts_at, appointment.ends_at))
    return busy


def is_free(periods: list[tuple[datetime, datetime]], start: datetime, end: datetime) -> bool:
    return all(end <= busy_start or start >= busy_end for busy_start, busy_end in periods)


def dentists_for(treatment: Treatment, dentist: Dentist | None) -> list[Dentist]:
    allowed = list(TREATMENTS[treatment].dentists)
    if dentist is None:
        return allowed
    if dentist not in allowed:
        raise CalendarError(
            "dentist_not_available",
            f"That dentist does not do {TREATMENTS[treatment].name_en.lower()}.",
        )
    return [dentist]


def find_slots(
    db: Session,
    visitor_id: uuid.UUID,
    treatment: Treatment,
    day: date | None = None,
    dentist: Dentist | None = None,
    limit: int = 3,
) -> list[Slot]:
    """Free slots on one day, or the earliest ones from today if no day is given."""
    dentists = dentists_for(treatment, dentist)
    length = timedelta(minutes=TREATMENTS[treatment].minutes)
    first = day or now().date()
    last = day or last_bookable_day()
    if first < now().date() or first > last_bookable_day():
        return []

    slots: list[Slot] = []
    current = first
    while current <= last and len(slots) < limit:
        busy = busy_periods(db, visitor_id, *day_bounds(current))
        last_pick: datetime | None = None
        for start in start_times(current, TREATMENTS[treatment].minutes):
            if last_pick and start - last_pick < SUGGESTION_GAP:
                continue
            end = start + length
            free = next((d for d in dentists if is_free(busy[d], start, end)), None)
            if free:
                slots.append(Slot(free, start, end))
                last_pick = start
            if len(slots) >= limit:
                break
        current += timedelta(days=1)
    return slots