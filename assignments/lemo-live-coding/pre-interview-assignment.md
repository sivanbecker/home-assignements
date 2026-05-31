# Live Coding Interview Preparation Assignment

Implement a small local web service **before the interview** so the environment, structure, tooling, and execution flow are already proven. The exact business prompt in the interview will still be new, but this preparation assignment is meant to ensure there is already a working TypeScript + Fastify server foundation ready to run, test, explain, and adapt quickly during the session. The interview instructions say the exercise will be a simple local web service with a couple of APIs, including one `POST` request with a JSON body and one `GET` request, and they emphasize a rock-solid working solution with a thoughtful, comprehensive test suite. [1]

## Objective

Create and commit a production-leaning local server foundation that can be started immediately during the interview and then adapted to the actual prompt with minimal friction. The implementation should optimize for:

- fast local startup
- easy manual testing with `curl`
- clear route/schema wiring
- generated OpenAPI documentation
- strong automated testing
- straightforward explanation of architecture choices
- confidence when using AI assistance during implementation

This assignment is intentionally **domain-neutral** so it can live in a public repository without implying the real interview task. Use placeholder endpoint names and neutral request/response examples. [1]

## Required stack

Use the following stack and conventions:

- **Language:** TypeScript
- **Framework:** Fastify
- **API documentation:** OpenAPI generated from Fastify route schemas
- **Validation:** Fastify JSON schema only
- **Testing:** Jest with `ts-jest`
- **Package manager:** npm
- **Linting/formatting:** ESLint + Prettier
- **Development runner:** `tsx watch`
- **Config:** typed config module with local `.env` support

Fastify supports schema-driven OpenAPI generation and Swagger UI through its official plugins, and Fastify recommends constructing the application separately from the network listener so tests can use `inject()` directly. [2][3][4]

## Required runtime behavior

The prepared server must already expose a simple working GET route and POST route so the local development environment is verified before the interview.

Use neutral placeholder routes such as:

- `GET /sample/health`
- `POST /sample/submit`

These routes are only preparation endpoints. During the interview, they can be adapted, replaced, or extended to match the real prompt.

### GET route requirements

- returns HTTP 200
- returns JSON
- serves as a quick proof that the app, config, logging, routing, and test setup work locally

### POST route requirements

- accepts a JSON request body
- validates the body using Fastify JSON schema
- returns JSON
- serves as a proof that schema validation, OpenAPI generation, and test flow are working end to end

The interview instructions explicitly say the live exercise should be runnable locally and should include one GET request and one POST request with a JSON body. [1]

## Suggested placeholder behavior

To keep the public repo neutral, the placeholder server can implement a generic echo-style or normalization-style API.

Example:

- `GET /sample/health` returns:
  ```json
  { "status": "ok" }
  ```

- `POST /sample/submit` accepts:
  ```json
  {
    "name": "example",
    "value": "demo"
  }
  ```

- and returns something like:
  ```json
  {
    "received": true,
    "name": "example",
    "value": "demo"
  }
  ```

The point is not the business logic. The point is to have a fully working, explainable local server foundation that proves routing, validation, documentation, testing, and local execution are all ready before the interview. [1]

## Architecture expectations

Use a production-leaning structure that matches the preferred working style:

```text
src/
  app.ts
  server.ts
  config.ts
  routes.ts
  handlers.ts
  controllers.ts
  schemas.ts
  plugins/
    swagger.ts
    logging.ts
  errors/
    errorHandler.ts
tests/
  app.test.ts
  routes.test.ts
  handlers.test.ts
  controllers.test.ts
  config.test.ts
scripts/
  curl-get.sh
  curl-post.sh
```

### File responsibilities

- `app.ts` — exports `buildApp()` and wires Fastify, plugins, routes, schemas, and error handling
- `server.ts` — startup entrypoint for the local server
- `config.ts` — typed configuration module; the only place that reads env values directly
- `routes.ts` — route registration and route schema attachment
- `handlers.ts` — Fastify-facing handlers that work with request/reply objects
- `controllers.ts` — app logic and response orchestration
- `schemas.ts` — JSON schemas for request and response payloads
- `plugins/swagger.ts` — OpenAPI and Swagger UI setup
- `plugins/logging.ts` — request logging setup if kept separate
- `errors/errorHandler.ts` — centralized non-validation error handling

This structure matches the preferred `routes.ts`, `handlers.ts`, and `controllers.ts` split while preserving a clear explanation of responsibilities. Fastify also has strong TypeScript support for typed route and request handling. [5][6]

## App construction pattern

The service must be built through a **`buildApp()` factory**.

### Why this is required

- enables tests without starting a real network listener
- matches Fastify’s recommended testing style using `inject()`
- separates bootstrapping from server startup
- makes route/plugin wiring easier to explain and verify

Fastify’s testing guidance emphasizes application construction separate from listening, which makes `inject()`-based testing simple and reliable. [4][7][8]

## Configuration

Use a **typed config module** with local `.env` support.

### Requirements

- keep all `process.env` access inside `config.ts`
- parse values such as `PORT`, `HOST`, and optional log level
- export a typed config object
- support `.env` for local development convenience

Using `dotenv` for local development and a typed config module for centralized access keeps configuration clean and testable. [9][10][11]

## OpenAPI and docs

Generate OpenAPI from **Fastify route schemas only**.

### Requirements

- define schemas for request and response payloads on each route
- register Swagger/OpenAPI generation through Fastify plugins
- expose a local Swagger UI route
- use route schemas as the single source of truth for both validation and docs

Fastify’s Swagger tooling supports OpenAPI generation from registered schemas and serving a Swagger UI route. [2][3][12]

## Validation and errors

Use **Fastify JSON schema validation** and keep **Fastify default validation errors** for invalid input.

### Additional expectations

- include a centralized error handler for non-validation failures
- keep error responses JSON-based
- avoid unnecessary custom validation abstractions in the prep assignment

This gives a production-leaning structure without adding extra complexity before the real prompt is known. [4][2]

## Logging and request identity

Include:

- request logging
- centralized error logging
- request or correlation id support

Fastify has built-in logging support and request-id behavior that help make even a small local service easier to reason about and explain. [13][14][15]

## Persistence

Keep the preparation server simple.

### Decision rule

- do not add persistence unless the placeholder behavior actually needs it
- if the placeholder POST route needs state, use simple in-memory storage only
- do not introduce database or repository abstractions unless the real interview prompt later justifies them

The purpose of this assignment is readiness, not speculative architecture.

## Testing requirements

The interview instructions explicitly emphasize a thoughtful, comprehensive test suite, so the prep server should already demonstrate layered testing. [1]

### Required test files

Create tests for each relevant layer:

- `app.test.ts`
- `routes.test.ts`
- `handlers.test.ts`
- `controllers.test.ts`
- `config.test.ts` if config parsing/defaulting is implemented
- optionally `errorHandler.test.ts` if error behavior is isolated

### Testing strategy

- **`app.test.ts`**: app composition and smoke-level startup behavior
- **`routes.test.ts`**: HTTP behavior through `buildApp()` + `fastify.inject()`; assert status codes, schema validation, response shape, and route wiring
- **`handlers.test.ts`**: unit tests for request/reply interaction and handler branching
- **`controllers.test.ts`**: unit tests for orchestration logic and any placeholder domain behavior
- **`config.test.ts`**: env parsing, defaults, and config shape

Fastify supports request injection for testing without opening a real port, which is ideal for route-level verification. [4][7][16]

### Coverage

Use **light** coverage thresholds. Coverage should encourage discipline without turning the prep assignment into a coverage exercise.

## Manual testing

Prepare two shell scripts so the server can be demonstrated immediately.

### `scripts/curl-get.sh`

```bash
curl -i http://localhost:3000/sample/health
```

### `scripts/curl-post.sh`

```bash
curl -i \
  -X POST http://localhost:3000/sample/submit \
  -H 'Content-Type: application/json' \
  -d '{"name":"example","value":"demo"}'
```

These are prep-only routes and payloads. They exist so the local server, request flow, and terminal workflow are already proven before the interview. The interview instructions explicitly say a terminal ready for `curl` is expected. [1]

## npm scripts

Prepare or expect scripts similar to these:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

`tsx watch` is a practical TypeScript development runner for fast local iteration. [17][18][19]

## How this prep assignment should be used

1. Implement the neutral placeholder server before the interview.
2. Verify the GET and POST routes locally with `curl`.
3. Verify route schemas and Swagger UI are working.
4. Verify tests are passing across app, routes, handlers, and controllers.
5. Use this working server as the starting point during the interview.
6. Adapt route names, schemas, and controller logic once the real prompt is given.

This approach keeps the initial technical setup solved ahead of time, so attention during the interview can focus on understanding the new problem, implementing the required logic, and explaining decisions clearly. [1]

## Explanation goals during the interview

Be ready to explain:

- why a prepared server foundation reduces setup risk
- why `buildApp()` improves testability
- why route schemas drive both validation and OpenAPI
- why `routes.ts`, `handlers.ts`, and `controllers.ts` are separated
- why tests are split by layer
- why the placeholder endpoints are intentionally neutral in a public repo
- why persistence was kept simple or omitted until needed
- why request logging and request IDs are useful even for a small local service

The interview instructions explicitly say they want to see how well the code is understood and owned, whether written manually or with AI assistance. [1]

## Non-goals

Unless the real prompt asks for them, do not optimize the prep assignment for:

- any specific business domain
- database integration
- authentication
- external infrastructure
- deployment concerns
- advanced abstractions that are not yet needed

The prep assignment exists to provide a fast, clean, explainable local server base. [1]

## Success criteria

A strong prep implementation should:

- already run locally before the interview
- expose one working GET route and one working POST route with JSON input
- generate OpenAPI docs from Fastify route schemas
- expose a local Swagger UI route
- include request logging and request-id support
- include centralized error handling
- include layered tests across app, routes, handlers, and controllers
- be demonstrable with two ready-to-run `curl` scripts
- be easy to adapt once the real prompt is revealed
- remain neutral enough to live comfortably in a public repository

## Claude usage note

During preparation and during the interview, Claude can be used to help with:

- understanding the live prompt
- deriving request and response schemas
- implementing Fastify route schemas
- writing handlers and controllers
- writing layered tests
- reviewing or explaining code structure
- generating diagrams or summaries to support explanation

All code must remain fully understandable and defensible by the implementer, because the interview instructions explicitly say they want ownership and understanding of every line of code, whether written manually or with AI assistance. [1]