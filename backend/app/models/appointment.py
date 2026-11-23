import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base
from app.models.enums import AppointmentStatus, BookedBy, Dentist, Treatment
from app.models.mixins import CreatedAtMixin, UuidPkMixin, str_enum


class Appointment(UuidPkMixin, CreatedAtMixin, Base):
    __tablename__ = "appointments"

    visitor_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("visitors.id", ondelete="CASCADE"), index=True
    )

    # Patient
    patient_name: Mapped[str] = mapped_column(String(100))
    # Digits only, so "333 123 4567" and "3331234567" match
    patient_phone: Mapped[str] = mapped_column(String(20), index=True)

    # Visit
    treatment: Mapped[Treatment] = mapped_column(str_enum(Treatment))
    dentist: Mapped[Dentist] = mapped_column(str_enum(Dentist))
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    # State
    status: Mapped[AppointmentStatus] = mapped_column(
        str_enum(AppointmentStatus), default=AppointmentStatus.BOOKED, index=True
    )
    booked_by: Mapped[BookedBy] = mapped_column(str_enum(BookedBy), default=BookedBy.AGENT)
    late_cancellation: Mapped[bool] = mapped_column(default=False)
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )