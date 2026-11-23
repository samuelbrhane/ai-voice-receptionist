"""Sends Vapi-style tool calls to the local API: check, book, find, reschedule, cancel."""

import json
import sys
import urllib.request

from app.config import VAPI_SERVER_SECRET as SECRET

API = "http://localhost:8000/api/vapi/tools"


def call(visitor_id: str, name: str, arguments: dict) -> dict:
    body = {"message": {"type": "tool-calls", "toolCallList": [
        {"id": f"test-{name}", "name": name, "arguments": arguments}
    ]}}
    request = urllib.request.Request(
        API,
        data=json.dumps(body).encode(),
        headers={
            "Content-Type": "application/json",
            "x-vapi-secret": SECRET,
            "x-visitor-id": visitor_id,
        },
    )
    with urllib.request.urlopen(request) as response:
        result = json.loads(json.load(response)["results"][0]["result"])
    print(f"\n{name}:\n{json.dumps(result, indent=2)}")
    return result


def main(visitor_id: str):
    slots = call(visitor_id, "check_availability", {"treatment": "cleaning"})["slots"]
    first, second = slots[0], slots[1]

    booked = call(visitor_id, "book_appointment", {
        "patient_name": "Marco Bianchi", "phone": "347 000 1111",
        "treatment": "cleaning", "dentist": first["dentist"], "start": first["start"],
    })

    call(visitor_id, "find_appointments", {"phone": "3470001111"})

    call(visitor_id, "reschedule_appointment", {
        "appointment_id": booked["appointment_id"],
        "new_start": second["start"], "dentist": second["dentist"],
    })

    call(visitor_id, "cancel_appointment", {"appointment_id": booked["appointment_id"]})

    call(visitor_id, "check_availability", {"treatment": "whitening", "dentist": "ferri"})


if __name__ == "__main__":
    main(sys.argv[1])