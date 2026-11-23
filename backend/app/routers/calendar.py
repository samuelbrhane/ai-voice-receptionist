from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.clinic import DENTISTS, TREATMENTS
from app.db import get_db
from app.models import Appointment, Visitor
from app.schemas import CalendarAppointment, CalendarOut
from app.services.calendar import now
from app.services.calendar.times import opening_window
from app.services.calendar_view import changed_by_agent, day_appointments, recent_changes
from app.services.visitors import get_visitor

router = APIRouter(prefix="/api", tags=["calendar"])


def _out(appointment: Appointment) -> CalendarAppointment:
    return CalendarAppointment(
        id=appointment.id,
        patient_name=appointment.patient_name,
        treatment=appointment.treatment,
        treatment_name=TREATMENTS[appointment.treatment].name_en,
        dentist=appointment.dentist,
        dentist_name=DENTISTS[appointment.dentist],
        starts_at=appointment.starts_at,
        ends_at=appointment.ends_at,
        status=appointment.status,
        booked_by=appointment.booked_by,
        changed_by_agent=changed_by_agent(appointment),
        updated_at=appointment.updated_at,
    )


@router.get("/calendar", response_model=CalendarOut, summary="One day of the calendar and the agent's recent changes")
def calendar(
    day: date | None = Query(default=None, alias="date"),
    visitor: Visitor = Depends(get_visitor),
    db: Session = Depends(get_db),
):
    day = day or now().date()
    window = opening_window(day)
    return CalendarOut(
        date=day,
        is_open=window is not None,
        opens_at=window[0].strftime("%H:%M") if window else None,
        closes_at=window[1].strftime("%H:%M") if window else None,
        appointments=[_out(a) for a in day_appointments(db, visitor.id, day)],
        recent=[_out(a) for a in recent_changes(db, visitor.id)],
    )