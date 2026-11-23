import random
import uuid
from datetime import date, datetime, time, timedelta

from sqlalchemy.orm import Session

from app.clinic import TREATMENTS
from app.config import CLINIC_TZ
from app.models import Appointment, BookedBy, Dentist, Treatment
from app.services.calendar.availability import is_free
from app.services.calendar.times import now, opening_window

SEED_DAYS = 14
FILL_CHANCE = 0.35

# Shown on the page so visitors can try rescheduling and cancelling
SAMPLE_PATIENT = ("Giulia Romano", "3331234567")

PATIENTS = [
    ("Paolo Greco", "3401112233"),
    ("Anna Conti", "3475556677"),
    ("Luca Bruno", "3389990011"),
    ("Chiara Marino", "3922223344"),
    ("Davide Moretti", "3207778899"),
    ("Sara Gallo", "3496665544"),
    ("Matteo Esposito", "3314443322"),
    ("Elena Ricci", "3881231234"),
]


def _sample_day(today: date) -> date:
    """The first Thursday at least two days away."""
    day = today + timedelta(days=2)
    while day.weekday() != 3:
        day += timedelta(days=1)
    return day


def _add(db, busy, visitor_id, name, phone, treatment, dentist, start) -> None:
    end = start + timedelta(minutes=TREATMENTS[treatment].minutes)
    db.add(Appointment(
        visitor_id=visitor_id,
        patient_name=name,
        patient_phone=phone,
        treatment=treatment,
        dentist=dentist,
        starts_at=start,
        ends_at=end,
        booked_by=BookedBy.SEED,
    ))
    busy[dentist].append((start, end))


def seed_calendar(db: Session, visitor_id: uuid.UUID) -> None:
    rng = random.Random(str(visitor_id))
    today = now().date()
    busy: dict[Dentist, list[tuple[datetime, datetime]]] = {d: [] for d in Dentist}

    sample_start = datetime.combine(_sample_day(today), time(10), CLINIC_TZ)
    _add(db, busy, visitor_id, *SAMPLE_PATIENT, Treatment.CLEANING, Dentist.FERRI, sample_start)

    for offset in range(SEED_DAYS):
        window = opening_window(today + timedelta(days=offset))
        if window is None:
            continue
        opens, closes = window
        for dentist in Dentist:
            options = [
                t for t, info in TREATMENTS.items()
                if dentist in info.dentists and t != Treatment.EMERGENCY
            ]
            start = opens
            while start < closes:
                treatment = rng.choice(options)
                end = start + timedelta(minutes=TREATMENTS[treatment].minutes)
                if rng.random() < FILL_CHANCE and end <= closes and is_free(busy[dentist], start, end):
                    _add(db, busy, visitor_id, *rng.choice(PATIENTS), treatment, dentist, start)
                    start = end
                else:
                    start += timedelta(minutes=30)
    db.flush()