"""Anonymous visitors, told apart by a cookie, each with their own calendar."""

import uuid

from fastapi import Depends, Request, Response
from sqlalchemy.orm import Session

from app.config import DEMO_MODE, VISITOR_COOKIE, VISITOR_COOKIE_DAYS
from app.db import get_db
from app.models import Visitor
from app.services.seed import seed_calendar


def create_visitor(db: Session) -> Visitor:
    visitor = Visitor()
    db.add(visitor)
    db.flush()
    seed_calendar(db, visitor.id)
    db.commit()
    return visitor


def _find(db: Session, raw_id: str | None) -> Visitor | None:
    try:
        return db.get(Visitor, uuid.UUID(raw_id)) if raw_id else None
    except ValueError:
        return None


def set_visitor_cookie(response: Response, visitor: Visitor) -> None:
    response.set_cookie(
        VISITOR_COOKIE,
        str(visitor.id),
        max_age=VISITOR_COOKIE_DAYS * 24 * 3600,
        httponly=True,
        samesite="lax",
        secure=DEMO_MODE,
    )


def get_visitor(request: Request, response: Response, db: Session = Depends(get_db)) -> Visitor:
    """FastAPI dependency: the current visitor, created on the first request."""
    visitor = _find(db, request.cookies.get(VISITOR_COOKIE))
    if visitor is None:
        visitor = create_visitor(db)
        set_visitor_cookie(response, visitor)
    return visitor


def reset_visitor(db: Session, visitor: Visitor) -> Visitor:
    """Delete the visitor's calendar and calls, and start fresh."""
    db.delete(visitor)  # the database cascades to appointments and call sessions
    db.flush()
    return create_visitor(db)