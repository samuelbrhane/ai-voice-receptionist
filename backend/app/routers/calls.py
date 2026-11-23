from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import MAX_CALL_SECONDS
from app.db import get_db
from app.models import Visitor
from app.schemas import CallStartIn, CallStartOut
from app.services.calendar import now
from app.services.limits import start_call
from app.services.visitors import get_visitor

router = APIRouter(prefix="/api/calls", tags=["calls"])


@router.post("/start", response_model=CallStartOut, summary="Check the demo limits and get the call settings")
def start(body: CallStartIn, visitor: Visitor = Depends(get_visitor), db: Session = Depends(get_db)):
    start_call(db, visitor, body.language)
    db.commit()
    moment = now()
    return CallStartOut(
        visitor_id=visitor.id,
        language=body.language,
        today=moment.strftime("%A %Y-%m-%d"),
        time_now=moment.strftime("%H:%M"),
        max_call_seconds=MAX_CALL_SECONDS,
    )