import re

from app.services.calendar.errors import CalendarError


def normalize_phone(raw: str) -> str:
    """Digits only, without the Italian country code, so every format matches."""
    digits = re.sub(r"\D", "", raw or "")
    if digits.startswith("0039"):
        digits = digits[4:]
    elif digits.startswith("39") and len(digits) == 12:
        digits = digits[2:]
    if len(digits) < 6:
        raise CalendarError("invalid_phone", "That phone number seems too short.")
    return digits