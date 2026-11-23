import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base
from app.models.mixins import UuidPkMixin


class CallSession(UuidPkMixin, Base):
    """One started voice call, counted for the daily demo limits."""

    __tablename__ = "call_sessions"

    visitor_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("visitors.id", ondelete="CASCADE"), index=True
    )
    language: Mapped[str] = mapped_column(String(2))
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )