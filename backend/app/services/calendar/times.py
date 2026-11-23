from collections.abc import Iterator
from datetime import date, datetime, time, timedelta

from app.clinic import BOOKING_WINDOW_DAYS, OPENING_HOURS, SLOT_STEP_MINUTES
from app.config import CLINIC_TZ

# Same-day bookings start at least this far from now
MIN_NOTICE = timedelta(minutes=30)


def now() -> datetime:
    return datetime.now(CLINIC_TZ)


def local(value: datetime) -> datetime:
    return value.astimezone(CLINIC_TZ)


def day_bounds(day: date) -> tuple[datetime, datetime]:
    start = datetime.combine(day, time.min, CLINIC_TZ)
    return start, start + timedelta(days=1)


def opening_window(day: date) -> tuple[datetime, datetime] | None:
    hours = OPENING_HOURS.get(day.weekday())
    if hours is None:
        return None
    opens, closes = hours
    return datetime.combine(day, opens, CLINIC_TZ), datetime.combine(day, closes, CLINIC_TZ)


def last_bookable_day() -> date:
    return now().date() + timedelta(days=BOOKING_WINDOW_DAYS)


def start_times(day: date, minutes: int, include_past: bool = False) -> Iterator[datetime]:
    """Every quarter-hour start on this day where a visit of this length fits."""
    window = opening_window(day)
    if window is None:
        return
    opens, closes = window
    step = timedelta(minutes=SLOT_STEP_MINUTES)
    length = timedelta(minutes=minutes)
    earliest = now() + MIN_NOTICE
    start = opens
    while start + length <= closes:
        if include_past or start >= earliest:
            yield start
        start += step