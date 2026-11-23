import uuid
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.clinic import TREATMENTS
from app.models import Appointment, Dentist, Treatment
from app.services.calendar.availability import busy_periods, dentists_for, is_free
from app.services.calendar.errors import CalendarError
from app.services.calendar.phone import normalize_phone
from app.services.calendar.times import last_bookable_day, local, now, start_times


def check_slot(
    db: Session,
    visitor_id: uuid.UUID,
    treatment: Treatment,
    dentist: Dentist,
    starts_at: datetime,
    exclude_id: uuid.UUID | None = None,
) -> tuple[datetime, datetime]:
    """Raise a CalendarError unless this visit can be booked; returns start and end."""
    dentists_for(treatment, dentist)
    minutes = TREATMENTS[treatment].minutes
    start = local(starts_at)
    end = start + timedelta(minutes=minutes)

    if start < now():
        raise CalendarError("in_the_past", "That time has already passed.")
    if start.date() > last_bookable_day():
        raise CalendarError("too_far_ahead", "Bookings are only possible up to 4 weeks ahead.")
    if start not in set(start_times(start.date(), minutes)):
        raise CalendarError(
            "outside_hours",
            "The clinic is closed at that time, or the visit would not fit before closing.",
        )

    busy = busy_periods(db, visitor_id, start, end, exclude_id)
    if not is_free(busy[dentist], start, end):
        raise CalendarError("slot_taken", "That time is already taken.")
    return start, end


def book(
    db: Session,
    visitor_id: uuid.UUID,
    patient_name: str,
    patient_phone: str,
    treatment: Treatment,
    dentist: Dentist,
    starts_at: datetime,
) -> Appointment:
    phone = normalize_phone(patient_phone)
    start, end = check_slot(db, visitor_id, treatment, dentist, starts_at)
    appointment = Appointment(
        visitor_id=visitor_id,
        patient_name=patient_name.strip(),
        patient_phone=phone,
        treatment=treatment,
        dentist=dentist,
        starts_at=start,
        ends_at=end,
    )
    db.add(appointment)
    db.flush()
    return appointment