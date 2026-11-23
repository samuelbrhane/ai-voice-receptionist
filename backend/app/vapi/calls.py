import json
from dataclasses import dataclass

from fastapi import Request

from app.config import DEMO_MODE


@dataclass
class ToolCall:
    id: str
    name: str
    arguments: dict


def tool_calls_from(message: dict) -> list[ToolCall]:
    """Vapi sends name and arguments either directly or inside a function object."""
    calls = []
    for raw in message.get("toolCallList") or []:
        function = raw.get("function") or {}
        name = raw.get("name") or function.get("name") or ""
        arguments = raw.get("arguments")
        if arguments is None:
            arguments = function.get("arguments", {})
        if isinstance(arguments, str):
            arguments = json.loads(arguments or "{}")
        calls.append(ToolCall(raw.get("id", ""), name, arguments or {}))
    return calls


def visitor_id_from(message: dict, request: Request) -> str | None:
    """The page passes visitorId when starting the call; Vapi includes the call details."""
    call = message.get("call") or {}
    overrides = call.get("assistantOverrides") or {}
    for source in (call.get("metadata"), overrides.get("metadata"), overrides.get("variableValues")):
        if isinstance(source, dict) and source.get("visitorId"):
            return str(source["visitorId"])
    # Local testing with curl only
    if not DEMO_MODE:
        return request.headers.get("x-visitor-id")
    return None