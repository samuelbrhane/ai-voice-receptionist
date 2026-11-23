from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.clinic import TREATMENTS
from app.config import MAX_CALL_SECONDS
from app.db import get_db
from app.models import Visitor
from app.schemas import SamplePatient, SessionOut
from app.services.calendar import find_upcoming
from app.services.limits import calls_left
from app.services.seed import SAMPLE_PATIENT
from app.services.visitors import get_visitor

router = APIRouter(prefix="/api", tags=["session"])


@router.get("/session", response_model=SessionOut, summary="Start or continue this browser's session")
def session(visitor: Visitor = Depends(get_visitor), db: Session = Depends(get_db)):
    name, phone = SAMPLE_PATIENT
    upcoming = find_upcoming(db, visitor.id, phone)
    sample = None
    if upcoming:
        first = upcoming[0]
        sample = SamplePatient(
            name=name,
            phone="333 123 4567",
            treatment_name=TREATMENTS[first.treatment].name_en,
            starts_at=first.starts_at,
        )
    return SessionOut(
        visitor_id=visitor.id,
        sample=sample,
        calls_left=calls_left(db, visitor),
        max_call_seconds=MAX_CALL_SECONDS,
    )