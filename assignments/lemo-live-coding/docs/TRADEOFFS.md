# TRADEOFFS — Onboarding Flow API

## Input Validation
**Choice:** Fastify JSON schema (no Zod)
**Tradeoff:** Zero extra dependency, automatic 400 + OpenAPI integration vs. less ergonomic error messages and no parse-time TypeScript inference
**Why here:** Consistent with the base server; schemas are single source of truth for validation and docs
**Scale note:** Not a scaling concern — schema validation is O(1) per request

## Error Handling
**Choice:** Domain errors (`SessionNotFoundError`, `SessionExpiredError`, `StepOrderError`) carry no HTTP knowledge; handlers map them to `OnboardingWebError extends WebError` with the correct status code
**Tradeoff:** Clean domain layer, reusable domain errors vs. slightly more mapping code in handlers
**Why here:** Keeps domain logic free of HTTP concerns; `WebError` is a base-server primitive available to all assignment branches
**Scale note:** Not a scaling concern

## Session State Machine
**Choice:** `SessionStep` enum + guard-before-transition
**Tradeoff:** Explicit, testable, impossible to miss invalid transitions vs. more verbose than a string field
**Why here:** Step ordering is the core invariant; enum makes it impossible to skip silently
**Scale note:** O(1) per request — not a scaling concern

## Duplicate Step Rejection
**Choice:** Reject with 409 (append-only sessions)
**Tradeoff:** Simple, predictable contract vs. less flexible for clients wanting to correct a mistake
**Why here:** Overwriting would silently invalidate a previously generated quote
**Scale note:** Not a scaling concern

## TTL Enforcement
**Choice:** Absolute TTL, passive check per request; no background sweep
**Tradeoff:** Zero infrastructure overhead vs. expired sessions linger in memory until next access
**Why here:** In-memory store at interview scale; a background sweep adds complexity with no real benefit
**Scale note:** Memory grows unbounded if sessions are created but never accessed — fix: setInterval sweep or native Redis TTL

## Quote Factors — Strategy Pattern
**Choice:** `PricingFactor` interface + composable factor objects in `QuoteEngine`
**Tradeoff:** Open/closed, easy to add factors vs. more files/types than a single function
**Why here:** Reusing proven pattern from lemo-live-coding; natural fit for weighted independent rules
**Scale note:** Not a scaling concern — factors are cheap in-process multipliers

## SessionRepository Abstraction (deferred)
**Choice:** `SessionStore` implemented directly as a `Map` — no interface extracted
**Tradeoff:** Simpler now vs. harder to swap for Redis without touching handlers
**Why here:** Interview scope is in-memory only; the interface adds boilerplate with no current benefit
**Scale note:** First thing to add when going multi-process — define `SessionRepository` interface, inject it

## Car Catalogue as Hard-coded Array
**Choice:** Eligible cars from a module-level constant
**Tradeoff:** Zero infrastructure vs. no dynamic data or versioning
**Why here:** Spec implies a fixed set of cars
**Scale note:** Inject as constructor/plugin param to swap with DB/API call later

## New Code Location
**Choice:** New domain logic in `src/onboarding/`; routes extended in `src/routes.ts`; tests in `tests/onboarding/`
**Tradeoff:** Keeps assignment code isolated from base server vs. slightly more navigation than a flat structure
**Why here:** Makes it easy to see what was added for this assignment vs. what came from the base server
**Scale note:** Not a scaling concern
