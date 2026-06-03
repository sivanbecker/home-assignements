# lemo-live-coding — Interview Base Server

Fastify + TypeScript foundation ready to extend during a live coding interview.

## Quick start

```bash
npm install
npm run dev          # dev server with hot reload (tsx watch)
```

Or build and run:
```bash
npm run build
npm start
```

Server starts at **http://127.0.0.1:3018**

## Test

```bash
npm test             # run all tests once
npm run test:watch   # watch mode
npm run typecheck    # TypeScript check only
```

## Smoke test with curl

```bash
# GET
curl -i http://localhost:3018/lemo

# POST
curl -i -X POST http://localhost:3018/lemo \
  -H 'Content-Type: application/json' \
  -d '{"name":"example","value":"demo"}'

# Or use the scripts:
bash scripts/curl-get.sh
bash scripts/curl-post.sh
```

## OpenAPI / Swagger UI

```
http://localhost:3018/docs
```

## Project structure

```
src/
  app.ts          — buildApp() factory, wires all plugins and routes
  server.ts       — starts the network listener
  config.ts       — typed config (reads PORT, HOST, LOG_LEVEL from env)
  routes.ts       — route registration
  handlers.ts     — thin Fastify handlers
  controllers.ts  — domain logic
  schemas.ts      — JSON schemas (validation + OpenAPI source of truth)
  errors/
    errorHandler.ts — centralized error handler
    WebError.ts     — base HTTP error class for handlers
  plugins/
    swagger.ts    — OpenAPI + Swagger UI
    logging.ts    — request logging
tests/
  app.test.ts
  routes.test.ts
  handlers.test.ts
  controllers.test.ts
  config.test.ts
```

## Extending for the interview

1. Add new routes to `src/routes.ts`
2. Add handlers in `src/handlers.ts` (or `src/onboarding/handlers.ts` for larger features)
3. Add domain logic in `src/controllers.ts`
4. Add schemas in `src/schemas.ts`
5. Tests in `tests/`

Use `WebError` from `src/errors/WebError.ts` in handlers to map domain errors to HTTP status codes.
