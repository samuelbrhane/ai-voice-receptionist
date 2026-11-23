"""Anonymous visitors, each with their own copy of the clinic calendar."""

from sqlalchemy.orm import Session

from app.models import Visitor
from app.services.seed import seed_calendar


def create_visitor(db: Session) -> Visitor:
    visitor = Visitor()
    db.add(visitor)
    db.flush()
    seed_calendar(db, visitor.id)
    return visitor