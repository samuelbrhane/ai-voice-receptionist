import json
import uuid

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Visitor
from app.services.calendar import CalendarError
from app.vapi import TOOLS, check_secret, tool_calls_from, visitor_id_from

router = APIRouter(prefix="/api/vapi", tags=["vapi"])


def _find_visitor(db: Session, raw_id: str | None) -> Visitor | None:
    try:
        return db.get(Visitor, uuid.UUID(raw_id)) if raw_id else None
    except ValueError:
        return None


def _run(db: Session, visitor: Visitor | None, name: str, arguments: dict) -> dict:
    if visitor is None:
        return {"ok": False, "error": "unknown_visitor", "message": "This call has no calendar attached."}
    tool = TOOLS.get(name)
    if tool is None:
        return {"ok": False, "error": "unknown_tool", "message": f"Unknown tool {name}."}
    try:
        return {"ok": True, **tool(db, visitor.id, arguments)}
    except CalendarError as error:
        return {"ok": False, "error": error.code, "message": error.message}


@router.post("/tools", include_in_schema=False)
async def tool_calls(request: Request, db: Session = Depends(get_db)):
    check_secret(request)
    message = (await request.json()).get("message") or {}
    visitor = _find_visitor(db, visitor_id_from(message, request))

    results = []
    for call in tool_calls_from(message):
        outcome = _run(db, visitor, call.name, call.arguments)
        # Vapi expects one single-line string per call, always with HTTP 200
        results.append({"toolCallId": call.id, "result": json.dumps(outcome, ensure_ascii=False)})

    db.commit()
    return {"results": results}