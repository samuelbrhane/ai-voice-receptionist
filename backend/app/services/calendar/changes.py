import uuid
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.clinic import LATE_CANCEL_HOURS
from app.models import Appointment, AppointmentStatus, Dentist
from app.services.calendar.booking import check_slot
from app.services.calendar.errors import CalendarError
from app.services.calendar.phone import normalize_phone
from app.services.calendar.times import now


def find_upcoming(db: Session, visitor_id: uuid.UUID, patient_phone: str) -> list[Appointment]:
    """Booked appointments from now on for this phone number, soonest first."""
    return list(db.scalars(
        select(Appointment)
        .where(
            Appointment.visitor_id == visitor_id,
            Appointment.patient_phone == normalize_phone(patient_phone),
            Appointment.status == AppointmentStatus.BOOKED,
            Appointment.starts_at >= now(),
        )
        .order_by(Appointment.starts_at)
    ))


def get_booked(db: Session, visitor_id: uuid.UUID, appointment_id: uuid.UUID) -> Appointment:
    appointment = db.get(Appointment, appointment_id)
    if (
        appointment is None
        or appointment.visitor_id != visitor_id
        or appointment.status != AppointmentStatus.BOOKED
    ):
        raise CalendarError("not_found", "I could not find that appointment.")
    return appointment


def reschedule(
    db: Session,
    visitor_id: uuid.UUID,
    appointment_id: uuid.UUID,
    new_start: datetime,
    dentist: Dentist | None = None,
) -> Appointment:
    appointment = get_booked(db, visitor_id, appointment_id)
    dentist = dentist or appointment.dentist
    start, end = check_slot(
        db, visitor_id, appointment.treatment, dentist, new_start, exclude_id=appointment.id
    )
    appointment.dentist = dentist
    appointment.starts_at = start
    appointment.ends_at = end
    db.flush()
    return appointment


def cancel(db: Session, visitor_id: uuid.UUID, appointment_id: uuid.UUID) -> Appointment:
    appointment = get_booked(db, visitor_id, appointment_id)
    appointment.status = AppointmentStatus.CANCELLED
    appointment.cancelled_at = now()
    appointment.late_cancellation = appointment.starts_at - now() < timedelta(hours=LATE_CANCEL_HOURS)
    db.flush()
    return appointment