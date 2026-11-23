import uuid
from collections.abc import Callable
from datetime import date, datetime

from sqlalchemy.orm import Session

from app.clinic import LATE_CANCEL_FEE_EUR, TREATMENTS
from app.config import CLINIC_TZ
from app.models import Dentist, Treatment
from app.services.calendar import (
    CalendarError, book, cancel, find_slots, find_upcoming, now, reschedule,
)
from app.vapi.formatting import appointment_info, slot_info


def _treatment(value) -> Treatment:
    try:
        return Treatment(str(value).lower())
    except ValueError:
        options = ", ".join(t.value for t in Treatment)
        raise CalendarError("unknown_treatment", f"Unknown treatment. Use one of: {options}.")


def _dentist(value) -> Dentist | None:
    if not value:
        return None
    try:
        return Dentist(str(value).lower())
    except ValueError:
        raise CalendarError("unknown_dentist", "Unknown dentist. Use ferri or vitale.")


def _day(value) -> date | None:
    if not value:
        return None
    try:
        return date.fromisoformat(str(value))
    except ValueError:
        raise CalendarError("bad_date", "Use the date format YYYY-MM-DD.")


def _start(value) -> datetime:
    try:
        moment = datetime.fromisoformat(str(value))
    except ValueError:
        raise CalendarError("bad_time", "Use the start format YYYY-MM-DDTHH:MM.")
    return moment if moment.tzinfo else moment.replace(tzinfo=CLINIC_TZ)


def _appointment_id(value) -> uuid.UUID:
    try:
        return uuid.UUID(str(value))
    except ValueError:
        raise CalendarError("not_found", "I could not find that appointment.")


def check_availability(db: Session, visitor_id: uuid.UUID, args: dict) -> dict:
    treatment = _treatment(args.get("treatment"))
    day = _day(args.get("date"))
    slots = find_slots(db, visitor_id, treatment, day, _dentist(args.get("dentist")))
    info = TREATMENTS[treatment]
    result = {
        "treatment": treatment.value,
        "minutes": info.minutes,
        "price_eur": info.price_eur,
        "slots": [slot_info(slot) for slot in slots],
    }
    if not slots:
        if treatment == Treatment.EMERGENCY:
            result["note"] = "No emergency slot left today. Tell the caller to come at 9:00 on the next opening day."
        elif day:
            result["note"] = "No free times on that day. Offer to check another day."
        else:
            result["note"] = "No free times in the next 4 weeks."
    return result


def book_appointment(db: Session, visitor_id: uuid.UUID, args: dict) -> dict:
    dentist = _dentist(args.get("dentist"))
    if dentist is None:
        raise CalendarError("missing_dentist", "Choose the dentist from the free slot.")
    appointment = book(
        db,
        visitor_id,
        patient_name=str(args.get("patient_name", "")),
        patient_phone=str(args.get("phone", "")),
        treatment=_treatment(args.get("treatment")),
        dentist=dentist,
        starts_at=_start(args.get("start")),
    )
    return {"booked": True, **appointment_info(appointment)}


def find_appointments(db: Session, visitor_id: uuid.UUID, args: dict) -> dict:
    appointments = find_upcoming(db, visitor_id, str(args.get("phone", "")))
    result = {"appointments": [appointment_info(a) for a in appointments]}
    if not appointments:
        result["note"] = "No upcoming appointments for that phone number."
    return result


def reschedule_appointment(db: Session, visitor_id: uuid.UUID, args: dict) -> dict:
    appointment = reschedule(
        db,
        visitor_id,
        _appointment_id(args.get("appointment_id")),
        _start(args.get("new_start")),
        _dentist(args.get("dentist")),
    )
    return {"rescheduled": True, **appointment_info(appointment)}


def cancel_appointment(db: Session, visitor_id: uuid.UUID, args: dict) -> dict:
    appointment = cancel(db, visitor_id, _appointment_id(args.get("appointment_id")))
    return {
        "cancelled": True,
        **appointment_info(appointment),
        "late_cancellation": appointment.late_cancellation,
        "fee_eur": LATE_CANCEL_FEE_EUR if appointment.late_cancellation else 0,
    }


TOOLS: dict[str, Callable[[Session, uuid.UUID, dict], dict]] = {
    "check_availability": check_availability,
    "book_appointment": book_appointment,
    "find_appointments": find_appointments,
    "reschedule_appointment": reschedule_appointment,
    "cancel_appointment": cancel_appointment,
}


def today_info() -> dict:
    moment = now()
    return {"today": moment.strftime("%A %Y-%m-%d"), "time_now": moment.strftime("%H:%M")}