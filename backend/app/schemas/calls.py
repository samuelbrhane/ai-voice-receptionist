import uuid
from typing import Literal

from pydantic import BaseModel


class CallStartIn(BaseModel):
    language: Literal["en", "it"]


class CallStartOut(BaseModel):
    """What the page passes to Vapi when it starts the call."""

    visitor_id: uuid.UUID
    language: Literal["en", "it"]
    today: str
    time_now: str
    max_call_seconds: int