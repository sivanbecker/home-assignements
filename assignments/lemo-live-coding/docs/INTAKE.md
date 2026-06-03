# INTAKE

## Functional Requirements

- `GET /cars?userId=<id>` — fetch cars registered to user from simulated vendor; return each car with `insurable: boolean` computed server-side
- `POST /quote` — accept user profile + selected carIds; return per-car premiums + combined premium with optional multi-car discount
- Insurability rules: year ≥ 2008, category ≠ "exotic", value < 150000
- Pricing: base $1000 × stacked risk multipliers (age, license seniority, car category)
- Multi-car discount: 5% off combined premium when ≥ 2 cars selected
- All premiums rounded to nearest integer

## Constraints and Edge Cases

- Vendor data is static in-memory — no DB, no real HTTP calls
- `GET /cars` returns ALL user cars (insurable and non-insurable) — client decides what to show
- `POST /quote` must reject non-insurable cars with 400
- `POST /quote` must reject carIds not found or not belonging to the requesting user with 400
- `POST /quote` must reject user age < 18 with 400
- `userId` not found in vendor → 400
- Risk multipliers stack multiplicatively (not additively)
- `licenseYear` is a year (e.g. 2018), seniority = current year − licenseYear
- Package manager: `npm` (existing project)
- Reuse existing `buildApp()`, `config.ts`, error handler, swagger plugins
