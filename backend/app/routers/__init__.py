from app.routers.calendar import router as calendar_router
from app.routers.calls import router as calls_router
from app.routers.demo import router as demo_router
from app.routers.session import router as session_router
from app.routers.vapi import router as vapi_router

__all__ = [
    "calendar_router",
    "calls_router",
    "demo_router",
    "session_router",
    "vapi_router",
]