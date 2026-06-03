# INTAKE — Onboarding Flow API

## Functional Requirements

- `POST /onboarding/start` — create a new session, return `sessionId`
- `POST /onboarding/:sessionId/profile` — accept personal details, return list of eligible cars
- `POST /onboarding/:sessionId/quote` — accept selected `carIds`, return a price quote
- `POST /onboarding/:sessionId/bind` — lock the quote with a timestamp
- `GET /onboarding/:sessionId` — return current step and relevant state
- Each step must verify the previous step was completed before proceeding
- Duplicate step calls (e.g. profiling twice) are rejected with 409

## Constraints and Edge Cases

- In-memory session store only — no persistence across restarts
- Session TTL: absolute from creation, checked passively on each request (expired → 410)
- Step ordering strictly enforced — out-of-order calls return 422
- Sessions are append-only — once a step is done, it cannot be redone (start a new session)
- `bind` locks the quote; no further mutations allowed after BOUND

## Scale Context

Single user per session, in-memory, interview scale (~tens of concurrent sessions). No persistence, no horizontal scale required. A single Fastify process is the target deployment.
