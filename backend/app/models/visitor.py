from app.db import Base
from app.models.mixins import CreatedAtMixin, UuidPkMixin


class Visitor(UuidPkMixin, CreatedAtMixin, Base):
    """An anonymous browser, told apart by a cookie, with its own calendar."""

    __tablename__ = "visitors"