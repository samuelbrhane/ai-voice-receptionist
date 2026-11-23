import uuid
from datetime import date, datetime

from pydantic import BaseModel

from app.models import AppointmentStatus, BookedBy, Dentist, Treatment


class CalendarAppointment(BaseModel):
    id: uuid.UUID
    patient_name: str
    treatment: Treatment
    treatment_name: str
    dentist: Dentist
    dentist_name: str
    starts_at: datetime
    ends_at: datetime
    status: AppointmentStatus
    booked_by: BookedBy
    changed_by_agent: bool
    updated_at: datetime


class CalendarOut(BaseModel):
    date: date
    today: date
    is_open: bool
    opens_at: str | None
    closes_at: str | None
    appointments: list[CalendarAppointment]
    recent: list[CalendarAppointment]