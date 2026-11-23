from dataclasses import dataclass
from datetime import time

from app.models.enums import Dentist, Treatment


@dataclass(frozen=True)
class TreatmentInfo:
    name_en: str
    name_it: str
    minutes: int
    price_eur: int
    dentists: tuple[Dentist, ...]


DENTISTS: dict[Dentist, str] = {
    Dentist.FERRI: "Dr. Elena Ferri",
    Dentist.VITALE: "Dr. Marco Vitale",
}

_BOTH = (Dentist.FERRI, Dentist.VITALE)

TREATMENTS: dict[Treatment, TreatmentInfo] = {
    Treatment.CHECKUP: TreatmentInfo("Check-up", "Visita di controllo", 30, 50, _BOTH),
    Treatment.CLEANING: TreatmentInfo("Cleaning", "Pulizia dei denti", 45, 70, _BOTH),
    Treatment.FILLING: TreatmentInfo("Filling", "Otturazione", 60, 120, _BOTH),
    Treatment.WHITENING: TreatmentInfo("Whitening", "Sbiancamento", 60, 250, (Dentist.VITALE,)),
    Treatment.EMERGENCY: TreatmentInfo("Emergency visit", "Visita urgente", 30, 80, _BOTH),
}

# Opening hours by weekday (Monday is 0); Sunday is closed
OPENING_HOURS: dict[int, tuple[time, time]] = {
    0: (time(9), time(18)),
    1: (time(9), time(18)),
    2: (time(9), time(18)),
    3: (time(9), time(18)),
    4: (time(9), time(18)),
    5: (time(9), time(13)),
}

# Rules
SLOT_STEP_MINUTES = 15       # appointments start on the quarter hour
BOOKING_WINDOW_DAYS = 28     # bookings up to 4 weeks ahead
LATE_CANCEL_HOURS = 24       # cancelling later than this costs a fee
LATE_CANCEL_FEE_EUR = 30