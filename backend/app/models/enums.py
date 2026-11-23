from enum import StrEnum


class Dentist(StrEnum):
    FERRI = "ferri"
    VITALE = "vitale"


class Treatment(StrEnum):
    CHECKUP = "checkup"
    CLEANING = "cleaning"
    FILLING = "filling"
    WHITENING = "whitening"
    EMERGENCY = "emergency"


class AppointmentStatus(StrEnum):
    BOOKED = "booked"
    CANCELLED = "cancelled"


class BookedBy(StrEnum):
    """Who created the appointment: the starting calendar or the voice agent."""

    SEED = "seed"
    AGENT = "agent"