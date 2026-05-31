# QUESTIONS

## Clarifying Questions

### Q1: Error handling strategy
How should invalid operations surface errors — throw typed exceptions, or return a result/discriminated union?

**Assumption stub:** Throw a typed `TaskError extends Error` for all failure cases (task not found, invalid title). Simple and idiomatic for a CLI context.

---

### Q2: Task ID format
Should task IDs be auto-incremented integers, UUIDs, or another format?

**Assumption stub:** Auto-incremented integers starting at 1. Simple, human-readable, no external dependency needed.

---

### Q3: Completing an already-completed task
Should marking an already-completed task as complete be a no-op, or an error?

**Assumption stub:** No-op — silently succeed. Idempotent behavior is usually safer for state mutation.

---

### Q4: Listing tasks — filtering or sorting?
Should `listTasks` support filtering by status (completed/incomplete) or any sorting?

**Assumption stub:** Return all tasks in insertion order, no filtering. Keep the API minimal unless asked.

---

### Q5: Persistence
Is the task store expected to persist across process restarts (file, DB), or is in-memory sufficient?

**Assumption stub:** In-memory only. No persistence layer required.

---

## Recommended Questions to Ask Interviewer

1. **Q1 (Error handling)** — Biggest design impact; affects every function signature and caller code.
2. **Q5 (Persistence)** — If they want file persistence, it changes the architecture significantly.

## Questions to Convert Into Explicit Assumptions

- Q2 (ID format) → use auto-increment integers
- Q3 (idempotent complete) → no-op
- Q4 (listing) → insertion order, no filtering
