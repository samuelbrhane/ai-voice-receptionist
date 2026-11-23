"""Book, find, reschedule and cancel on a fresh visitor, then roll everything back."""

from app.db import SessionLocal
from app.models import Treatment
from app.services.calendar import (
    CalendarError, book, cancel, find_slots, find_upcoming, local, reschedule,
)
from app.services.visitors import create_visitor


def show(label, appointment):
    start = local(appointment.starts_at).strftime("%a %d %b %H:%M")
    print(f"{label}: {appointment.patient_name}, {appointment.treatment}, "
          f"{appointment.dentist}, {start}, {appointment.status}")


def main():
    db = SessionLocal()
    try:
        visitor = create_visitor(db)

        print("Giulia's appointments:")
        for appointment in find_upcoming(db, visitor.id, "+39 333 123 4567"):
            show("  found", appointment)

        slots = find_slots(db, visitor.id, Treatment.CLEANING)
        print("Free cleaning slots:")
        for slot in slots:
            print(f"  {local(slot.starts_at).strftime('%a %d %b %H:%M')} with {slot.dentist}")

        new = book(db, visitor.id, "Marco Bianchi", "347 000 1111",
                   Treatment.CLEANING, slots[0].dentist, slots[0].starts_at)
        show("Booked", new)

        try:
            book(db, visitor.id, "Someone Else", "3470002222",
                 Treatment.CLEANING, slots[0].dentist, slots[0].starts_at)
        except CalendarError as error:
            print(f"Double booking blocked: {error.code}")

        moved = reschedule(db, visitor.id, new.id, slots[1].starts_at, slots[1].dentist)
        show("Rescheduled", moved)

        cancelled = cancel(db, visitor.id, moved.id)
        show("Cancelled", cancelled)
        print(f"Late cancellation: {cancelled.late_cancellation}")
    finally:
        db.rollback()
        db.close()


if __name__ == "__main__":
    main()