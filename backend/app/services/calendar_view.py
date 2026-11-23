import uuid
from datetime import date, timedelta

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models import Appointment, AppointmentStatus, BookedBy
from app.services.calendar.times import day_bounds

RECENT_LIMIT = 8


def changed_by_agent(appointment: Appointment) -> bool:
    """Booked, moved or cancelled during a call, as opposed to the starting calendar."""
    return (
        appointment.booked_by == BookedBy.AGENT
        or appointment.status == AppointmentStatus.CANCELLED
        or appointment.updated_at - appointment.created_at > timedelta(seconds=1)
    )


def day_appointments(db: Session, visitor_id: uuid.UUID, day: date) -> list[Appointment]:
    start, end = day_bounds(day)
    return list(db.scalars(
        select(Appointment)
        .where(
            Appointment.visitor_id == visitor_id,
            Appointment.status == AppointmentStatus.BOOKED,
            Appointment.starts_at >= start,
            Appointment.starts_at < end,
        )
        .order_by(Appointment.starts_at)
    ))


def recent_changes(db: Session, visitor_id: uuid.UUID) -> list[Appointment]:
    return list(db.scalars(
        select(Appointment)
        .where(
            Appointment.visitor_id == visitor_id,
            or_(
                Appointment.booked_by == BookedBy.AGENT,
                Appointment.status == AppointmentStatus.CANCELLED,
                Appointment.updated_at > Appointment.created_at + timedelta(seconds=1),
            ),
        )
        .order_by(Appointment.updated_at.desc())
        .limit(RECENT_LIMIT)
    ))