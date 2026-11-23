import uuid
from datetime import datetime

from pydantic import BaseModel


class SamplePatient(BaseModel):
    name: str
    phone: str
    treatment_name: str
    starts_at: datetime


class SessionOut(BaseModel):
    visitor_id: uuid.UUID
    sample: SamplePatient | None
    calls_left: int | None
    max_call_seconds: int