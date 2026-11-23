import secrets

from fastapi import HTTPException, Request

from app.config import VAPI_SERVER_SECRET


def check_secret(request: Request) -> None:
    """Only Vapi knows the secret; anything else gets a 401."""
    given = request.headers.get("x-vapi-secret") or ""
    if not given:
        given = request.headers.get("authorization", "").removeprefix("Bearer ").strip()
    if not VAPI_SERVER_SECRET or not secrets.compare_digest(given, VAPI_SERVER_SECRET):
        raise HTTPException(status_code=401, detail="Not allowed")