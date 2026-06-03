# Hard — Onboarding Flow API

A stateful multi-step onboarding: user registers → submits personal details → gets eligible car list → selects cars → receives and optionally accepts a quote → quote is "bound" (locked in). Each step validates the previous one was completed.

## Endpoints

- `POST /onboarding/start` — creates a session, returns `sessionId`
- `POST /onboarding/:sessionId/profile` — submits personal details, validates, returns eligible cars
- `POST /onboarding/:sessionId/quote` — submits selected carIds, returns quote
- `POST /onboarding/:sessionId/bind` — accepts the quote, locks it with a timestamp
- `GET /onboarding/:sessionId` — returns current step + state

## Constraints

- In-memory session store
- Session expiry (TTL)
- Step ordering enforced (can't bind before quoting)
