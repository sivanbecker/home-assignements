# DECISIONS — Onboarding Flow API

- **Framework:** Fastify — reusing existing `buildApp()`, `errorHandler`, plugin setup from lemo-live-coding base
- **Input validation:** Fastify JSON schema on all routes — automatic 400, single source of truth for OpenAPI
- **Error handling:** Domain errors (`SessionNotFoundError`, `SessionExpiredError`, `StepOrderError`) have no HTTP knowledge; handlers catch them and map to `OnboardingWebError extends WebError` with the correct `statusCode`; existing `errorHandler` detects it via `instanceof WebError` and returns `{ statusCode, error, message }`
- **Call flow:** `route → handler → controller → SessionStore / QuoteEngine` — mirrors the base server's `route → handler → controller` pattern
- **Session state machine:** `SessionStep` enum (`STARTED | PROFILED | QUOTED | BOUND`); guard-before-transition pattern enforces ordering
- **Duplicate step calls:** Reject with 409 — sessions are append-only
- **TTL:** 30-minute absolute TTL from creation, checked passively on each request; 410 on expiry; no background sweep
- **Quote factors:** Reuse Strategy Pattern from lemo-live-coding — `PricingFactor` interface, `CarCountFactor` + `AgeFactor` implementations composed into `QuoteEngine`
- **Testing:** `fastify.inject()` integration tests for routes + unit tests for `SessionStore` and `QuoteEngine`; tests live in `tests/onboarding/`
