from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import get_db
from app.routers import calendar_router, calls_router, demo_router, session_router, vapi_router

app = FastAPI(
    title="Aurelia Dental Voice Receptionist API",
    description="Calendar and booking tools for an AI voice receptionist.",
    version="0.1.0",
    # Under /api so the docs work through the Next.js proxy too
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url=None,
)

app.include_router(session_router)
app.include_router(calendar_router)
app.include_router(calls_router)
app.include_router(demo_router)
app.include_router(vapi_router)


@app.get("/api/health", tags=["system"], summary="Check the API and database")
def health(db: Session = Depends(get_db)):
    db.execute(text("select 1"))
    return {"status": "ok", "database": "ok"}