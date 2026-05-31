# DECISIONS

- **Validation:** Fastify JSON schema only — no Zod, no class validators; schemas defined in `schemas.ts` and attached at route registration
- **Error handling:** Fastify default validation errors (400) pass through unchanged; non-validation errors (5xx) handled by centralized `errorHandler.ts` returning `{ statusCode, error, message }`
- **Data modeling:** Plain TypeScript interfaces in `schemas.ts` / `types.ts` — no classes, no ORM
- **Async:** All handlers are `async`; no I/O beyond in-process logic, so no queues or streams needed
- **Testing pattern:** `describe`/`it` blocks with `fastify.inject()` for route tests; plain unit tests for controllers and config; `test.each` only if clearly reduces repetition
- **Package manager:** `npm` (assignment requirement — overrides project default of pnpm)
- **Dev runner:** `tsx watch` for fast local iteration without a build step
- **OpenAPI:** `@fastify/swagger` + `@fastify/swagger-ui`; Swagger UI at `/docs`; route schemas are single source of truth for both validation and docs
- **Request ID:** Fastify built-in with `X-Request-Id` header; generated if absent; included in all log lines
- **Config:** `dotenv` for local dev; `config.ts` is the only file that reads `process.env`; `.env.example` committed, `.env` gitignored
- **Coverage:** Light thresholds — 70% lines, 60% branches
