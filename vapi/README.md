# Vapi setup

The two assistants and five tools live in the Vapi dashboard. This folder keeps their setup in the repo.

## Tools

Create each tool in `tools.json` as a **Function** tool:

- **Server URL:** `https://YOUR-API-DOMAIN/api/vapi/tools` (all five tools use the same URL)
- **HTTP header:** `x-vapi-secret` set to the backend's `VAPI_SERVER_SECRET`
- **Async** and **Strict** off

## Assistants

| Setting | English | Italian |
|---|---|---|
| Name | Aurelia Dental · English | Aurelia Dental · Italiano |
| First message | Hello, this is Sofia from Aurelia Dental. How can I help you today? | Buongiorno, sono Sofia di Aurelia Dental. Come posso aiutarla? |
| System prompt | `system-prompt.md` | `system-prompt.md` with the Italian language section |
| Transcriber | Deepgram Nova 3, English | Deepgram Nova 3, Italian |
| Voice | an English voice | an Italian voice |
| Tools | all five | all five |
| Max duration | 120 seconds | 120 seconds |

## Public key

Create a public key restricted to the frontend's address (and `http://localhost:3000` for local work) and to both assistants. It goes in the frontend's `NEXT_PUBLIC_VAPI_PUBLIC_KEY`.