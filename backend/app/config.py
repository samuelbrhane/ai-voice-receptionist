import os
from pathlib import Path
from zoneinfo import ZoneInfo

from dotenv import load_dotenv

load_dotenv()

# Paths
BASE_DIR = Path(__file__).resolve().parents[1]

# Database
DATABASE_URL = os.environ["DATABASE_URL"]

# Clinic
CLINIC_TZ = ZoneInfo("Europe/Rome")

# Visitors
VISITOR_COOKIE = "receptionist_visitor"
VISITOR_COOKIE_DAYS = 180

# Public demo
DEMO_MODE = os.getenv("DEMO_MODE", "false").lower() == "true"

# Vapi sends this in the x-vapi-secret header on every tool call
VAPI_SERVER_SECRET = os.getenv("VAPI_SERVER_SECRET", "")

# Demo limits, applied when DEMO_MODE is on
DAILY_CALLS_PER_VISITOR = int(os.getenv("DAILY_CALLS_PER_VISITOR", "3"))
DAILY_CALLS_TOTAL = int(os.getenv("DAILY_CALLS_TOTAL", "40"))
MAX_CALL_SECONDS = int(os.getenv("MAX_CALL_SECONDS", "120"))