"""Creates a visitor with a starting calendar and prints its id, for local tool tests."""

from app.db import SessionLocal
from app.services.visitors import create_visitor

db = SessionLocal()
visitor = create_visitor(db)
db.commit()
print(visitor.id)
db.close()