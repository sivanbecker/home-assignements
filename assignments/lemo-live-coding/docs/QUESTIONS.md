# QUESTIONS

## High-Impact Clarifying Questions

### Q1: What year is "current year" for license seniority calculation?
Seniority = current year − licenseYear. Should this use `new Date().getFullYear()` (runtime) or a fixed year for deterministic tests?
- **Assumption stub:** Use `new Date().getFullYear()` in production code; tests will pass an explicit `currentYear` parameter to the pricing function to stay deterministic.

### Q2: What if `carIds` in POST /quote contains a car that belongs to the user but is non-insurable?
The assignment says reject with 400, but should the error name all rejected cars or just the first?
- **Assumption stub:** Return 400 with a message listing all non-insurable carIds in one response. message should say something like "quote request contain non insurable cars" and contain the relevant cars info.  

### Q3: Should `POST /quote` validate that the carIds actually belong to the userId in the request body?
The user submits both `user` profile and `carIds` — but there's no `userId` in the POST body. How do we know which user's cars the carIds refer to?
- **Assumption stub:** Add `userId` to the POST /quote request body so ownership can be verified against vendor data.


### Q4: What happens with an empty `carIds` array?
- **Assumption stub:** Return 400 — a quote requires at least one car.

### Q5: Are premiums per-car calculated independently, then combined — or is the combined premium a separate calculation?
- **Assumption stub:** Each car premium is calculated independently; combined = sum of individual premiums × 0.95 if ≥ 2 cars.

---

## Recommended Questions to Ask Interviewer
1. **Q3 (userId in POST body)** — biggest design impact; affects the request schema and ownership validation logic
2. **Q1 (current year)** — affects testability of the pricing function

## Questions to Convert into Explicit Assumptions
- Q2, Q4, Q5 — defaults above are reasonable; no need to ask
