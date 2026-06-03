# QUESTIONS — Onboarding Flow API

## Q1: What is the expected session volume and TTL duration?
**Assumption:** Interview scale — tens of sessions. TTL = 30 minutes absolute from creation.

## Q2: What makes a car "eligible" in the profile step?
**Assumption:** Same insurability rules as lemo-live-coding base: year ≥ 2008, category ≠ exotic, value < 150,000. Car catalogue is a hard-coded in-memory array.

## Q3: What pricing factors apply to the quote?
**Assumption:** Reuse existing Strategy pattern: base $1000, age factor, car count discount (≥2 cars → ×0.95). Per-car premiums + combined total returned.

## Q4: What happens to an expired session on access?
**Assumption:** Return 410 Gone with a clear message. No auto-cleanup — passive TTL check only.

## Q5: Should concurrent requests to the same session be safe?
**Assumption:** No — single-threaded Node.js, in-memory store, no locking needed at interview scale.

---

## Recommended to ask interviewer
- Q2 (eligibility rules) — biggest impact on business logic
- Q3 (pricing factors) — determines complexity of QuoteEngine

## Converted to explicit assumptions
- Q1, Q4, Q5 — reasonable defaults, low design impact
