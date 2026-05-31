# INTAKE

## Functional Requirements

- Expose `GET /lemo/health` → `{ "status": "ok" }` (HTTP 200, JSON)
- Expose `POST /lemo/` → accepts `{ name: string, value: string }`, validates via Fastify JSON schema, returns `{ received: true, name, value }` (HTTP 200, JSON)
- Generate OpenAPI documentation from Fastify route schemas
- Serve a local Swagger UI route
- Include request logging and request-id support
- Include centralized error handling for non-validation failures
- Provide two `curl` demo scripts: `scripts/curl-get.sh` and `scripts/curl-post.sh`
- Typed config module (reads `PORT`, `HOST`, log level) backed by `.env`

## Constraints and Edge Cases

- No persistence — POST is echo/normalization only; no in-memory state needed for the placeholder
- No auth, no DB, no external infrastructure
- Neutral/domain-agnostic so assignment lives safely in a public repo
- Package manager: `npm` (not pnpm — this assignment overrides the default)
- Dev runner: `tsx watch` (not `ts-node`)
- Testing: Jest + `ts-jest`, using `fastify.inject()` (no real port opened in tests)
- Schema validation is Fastify JSON schema only — no Zod, no class-based validators
- Coverage: light thresholds only (discipline, not a coverage exercise)
- Must be explainable line-by-line during an interview — no opaque abstractions
