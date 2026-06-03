# DEBRIEF — Onboarding Flow API
> Written after Phase 5 — 2026-06-03

---

## What Was Built

A stateful multi-step onboarding API built on top of the existing lemo-live-coding Fastify base server. Five endpoints implement a session state machine: start → profile → quote → bind, with a status read at any point.

### Module breakdown

| Module | What it does |
|---|---|
| `onboarding/types.ts` | `SessionStep` enum, `STEP_ORDER`, `Session`, `CarOption`, `Quote`, `ProfileBody` |
| `onboarding/errors.ts` | 4 domain errors (no HTTP) + `OnboardingWebError extends WebError` |
| `onboarding/SessionStore.ts` | In-memory session CRUD, TTL enforcement, forward-only step advancement |
| `onboarding/carRepository.ts` | Static car catalogue, eligibility filtering |
| `onboarding/QuoteEngine.ts` | Strategy pattern pricing with typed `perCarFactors` / `totalFactors` split |
| `onboarding/controllers.ts` | Pure orchestration — step guards, eligibility validation, QuoteEngine calls |
| `onboarding/handlers.ts` | Thin HTTP layer — `mapDomainError`, `makeOnboardingHandlers` factory |
| `onboarding/schemas.ts` | Fastify JSON schemas for validation + OpenAPI |

---

## Patterns Used

### Strategy Pattern — `QuoteEngine`
`PricingFactor` hierarchy (`ProfilePricingFactor`, `CarPricingFactor`) for per-car multipliers, `TotalPricingFactor` for post-sum discounts. Key insight during implementation: separating `perCarFactors` and `totalFactors` into a typed `QuoteFactors` map eliminated the need for `instanceof` checks inside `calculate()`. The factor classification is declared at construction time, not at runtime.

### Factory Function — `makeOnboardingHandlers`
Handlers are closures over an injected `SessionStore` and `QuoteEngine`. This ensures each `buildApp()` call (including in tests) gets a fresh store — correct test isolation without module-level singletons.

### Guard-before-transition — `requireStep` + `advanceStep`
Two distinct error types (`StepAlreadyDoneError` vs `StepPrerequisiteError`) encode the semantic difference between "you already did this" (409) and "you haven't done the prerequisite yet" (422). This was a design choice that emerged during implementation — the initial single `StepOrderError` was too coarse for clean HTTP mapping.

### Domain error → HTTP error mapping — `mapDomainError`
A single function in `handlers.ts` maps 4 domain errors to 4 HTTP codes. Domain layer knows nothing about HTTP. This pattern scales cleanly: add a new domain error, add one line to `mapDomainError`.

---

## Key Design Decisions and Outcomes

**`update()` restricted to data fields, `advanceStep()` for step transitions** — Discovered during TDD that allowing `Partial<Session>` in `update()` would let callers silently overwrite `step`, `sessionId`, and `createdAt`. Type-restricting the patch with `Omit<..., 'sessionId' | 'createdAt' | 'step'>` makes the invariant compiler-enforced.

**`STEP_ORDER` in `types.ts`** — Initially duplicated in `SessionStore` and `controllers`. Extracted to `types.ts` after the reviewer flagged it. Single source of truth: adding a new step requires changing only one array.

**Store injection into `buildApp()`** — Originally singletons at module level in `handlers.ts` — all tests would share the same store. Moved construction to `registerRoutes()`, then made injectable via `buildApp({ store })`. This enabled the TTL integration test (410 path) without env var hacks.

**carIds eligibility validation** — The initial implementation silently returned `total: 0` for ineligible car IDs (the `if (!car) continue` path in `QuoteEngine`). Added explicit validation in `submitQuote` after the reviewer flagged it as a correctness bug.

---

## What I'd Change With More Time

1. **Discriminated union for `Session`** — The flat interface with 5 optional fields allows illegal states like a `BOUND` session with no `quote`. A discriminated union (`StartedSession | ProfiledSession | QuotedSession | BoundSession`) would make these states unrepresentable at compile time. Non-trivial refactor but the right long-term shape.

2. **`mapDomainError` exhaustiveness check** — Currently re-throws unknown errors silently (→ 500). A compile-time exhaustiveness guard would catch missing cases when new domain errors are added.

3. **Pre-compute eligible cars** — `getAllCars().filter(isEligible)` runs on every `submitProfile`. Since the catalogue is static, this should be computed once at module load.

4. **`jest.useFakeTimers()` for TTL test** — The TTL unit test uses a real `setTimeout(10ms)`, which is flaky on slow CI. Should use fake timers.

---

## Lessons Learned

- **Two errors are better than one** — `StepOrderError` was the first instinct, but the 409/422 distinction forced a split into `StepAlreadyDoneError` and `StepPrerequisiteError`. The type hierarchy made the HTTP mapping unambiguous.
- **O(N×M) is easy to miss** — `eligibleCars.find()` inside the `QuoteEngine` loop was the kind of bug that passes all tests at N=5 and only shows up at scale. The Map fix was one line; the scale test guards the regression.
- **Singletons in modules leak across tests** — The module-level store singleton was a latent test-isolation risk. The `makeOnboardingHandlers` factory pattern is the right fix and maps directly to how you'd inject dependencies in production (Fastify decorators, DI container, etc.).
- **Inject, don't thread scalars** — When the TTL test needed a short-lived store, the temptation was to thread `ttlMs` through `buildApp() → registerRoutes() → SessionStore`. The cleaner answer was to inject the store directly — the app layer doesn't need to know about TTL at all.

---

## Scaling Retrospective

| Component | Current limit | Minimum change to scale | Architectural enabler |
|---|---|---|---|
| `SessionStore` | ~100k in-memory sessions; lost on restart | Extract `SessionRepository` interface; inject Redis-backed impl | `makeOnboardingHandlers` injection point already in place — zero handler changes |
| TTL enforcement | Expired sessions linger until accessed | Add `this.sessions.delete(sessionId)` in `get()` before throw; or use Redis native TTL | Passive eviction already in `get()` — one line to add active eviction |
| Car catalogue | Static hard-coded array; re-filtered on every `submitProfile` | Pre-compute `ELIGIBLE_CARS` at module load; for dynamic catalogue inject via `buildApp()` | `carRepository.ts` is already isolated — swap `getAllCars()` implementation |
| `QuoteEngine` | Sync, single-process | Stateless — safe to share across requests with no changes | Pure function, no side effects |
| Step ordering | O(1) enum lookup | Not a concern | `STEP_ORDER` constant, `STEP_INDEX` Map would be micro-optimization only |
