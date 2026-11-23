from datetime import datetime

from app.clinic import DENTISTS, TREATMENTS
from app.models import Appointment
from app.services.calendar import Slot, local


def when(value: datetime) -> dict:
    moment = local(value)
    return {
        "weekday": moment.strftime("%A"),
        "date": moment.strftime("%Y-%m-%d"),
        "time": moment.strftime("%H:%M"),
        "start": moment.strftime("%Y-%m-%dT%H:%M"),
    }


def slot_info(slot: Slot) -> dict:
    return {
        "dentist": slot.dentist.value,
        "dentist_name": DENTISTS[slot.dentist],
        **when(slot.starts_at),
    }


def appointment_info(appointment: Appointment) -> dict:
    treatment = TREATMENTS[appointment.treatment]
    return {
        "appointment_id": str(appointment.id),
        "patient_name": appointment.patient_name,
        "treatment": appointment.treatment.value,
        "treatment_name": treatment.name_en,
        "price_eur": treatment.price_eur,
        "dentist": appointment.dentist.value,
        "dentist_name": DENTISTS[appointment.dentist],
        **when(appointment.starts_at),
    }