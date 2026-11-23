from datetime import datetime, time

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import CLINIC_TZ, DAILY_CALLS_PER_VISITOR, DAILY_CALLS_TOTAL, DEMO_MODE
from app.models import CallSession, Visitor
from app.services.calendar import now


def _start_of_today() -> datetime:
    return datetime.combine(now().date(), time.min, CLINIC_TZ)


def calls_today(db: Session, visitor: Visitor | None = None) -> int:
    query = select(func.count()).select_from(CallSession).where(
        CallSession.started_at >= _start_of_today()
    )
    if visitor is not None:
        query = query.where(CallSession.visitor_id == visitor.id)
    return db.scalar(query) or 0


def calls_left(db: Session, visitor: Visitor) -> int | None:
    """None when there is no limit (local development)."""
    if not DEMO_MODE:
        return None
    return max(0, DAILY_CALLS_PER_VISITOR - calls_today(db, visitor))


def start_call(db: Session, visitor: Visitor, language: str) -> None:
    """Record a call, or refuse it with a message the page can show."""
    if DEMO_MODE:
        if calls_today(db, visitor) >= DAILY_CALLS_PER_VISITOR:
            raise HTTPException(
                status_code=429,
                detail=f"You've used today's {DAILY_CALLS_PER_VISITOR} demo calls. Watch the recorded demo below, or come back tomorrow.",
            )
        if calls_today(db) >= DAILY_CALLS_TOTAL:
            raise HTTPException(
                status_code=429,
                detail="The live demo has reached today's limit. Watch the recorded demo below, or come back tomorrow.",
            )
    db.add(CallSession(visitor_id=visitor.id, language=language))
    db.flush()