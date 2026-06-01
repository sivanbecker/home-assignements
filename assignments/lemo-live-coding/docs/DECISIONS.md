# DECISIONS

- **Validation:** Fastify JSON schema for HTTP boundary (request body/query); manual guards inside domain logic for business rule violations
- **Error handling:** All business logic and validations live in controllers only. Each validation failure throws a unique typed domain error (e.g. `DriverTooYoungError`, `CarNotInsurableError`, `UserNotFoundError`). Handlers catch domain errors → wrap in `QuoteError extends Error` (carries `statusCode: 400`) with the original message → re-throw. `errorHandler.ts` detects `QuoteError` by `statusCode` and sends the right HTTP response; everything else becomes 500.
- **Domain errors:** Each domain error class extends `Error` with a descriptive message in the constructor — no HTTP knowledge. `QuoteError` is the HTTP translation layer, created only in handlers.
- **Data modeling:** Plain `readonly` interfaces — `Car`, `VendorCar`, `InsurableCar`, `UserProfile`, `QuoteRequest`, `QuoteResult`; no classes in domain
- **Async:** Synchronous only — vendor is in-memory, no I/O
- **Current year:** `new Date().getFullYear()` in production; pricing function accepts optional `currentYear` param for deterministic tests
- **userId in POST /quote:** Added to request body — required for car ownership verification against vendor data
- **Empty carIds:** 400 error — a quote requires at least one car
- **Testing pattern:** `describe`/`it` with `test.each` for pricing multiplier combinations; `fastify.inject()` for HTTP layer
- **Risk factors:** Strategy pattern — each factor is a `(profile, car) => number` function in an array; pricing engine multiplies them together. Adding/removing a factor = one function + one describe block, zero changes to the engine or existing tests.
- **Insurability rules:** Same strategy pattern — each rule is a `(car: VendorCar) => string | null` function (null = passes, string = failure reason); engine collects all failure reasons. Adding/removing a rule = one function + one describe block.
- **New modules:** `src/vendor.ts` (in-memory data + fetch), `src/errors.ts` (all domain error classes), `src/pricing.ts` (risk factors + engine); controllers expanded for new routes; handlers catch domain errors and convert to 400
