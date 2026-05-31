# DECISIONS

## Technical Choices

- **Error handling:** Throw `TaskError extends Error` for all failure cases (task not found, invalid title). No discriminated unions — CLI context makes throw idiomatic and keeps callers clean.
- **Task ID format:** Auto-incremented integers (1, 2, 3…). Human-readable, no external dependency, simple to test.
- **Idempotent complete:** Marking an already-completed task as complete is a no-op (silent success). Avoids surprising callers with errors on harmless double-calls.
- **Listing:** Return all tasks in insertion order. No filtering or sorting — minimal API unless extended later.
- **Persistence:** In-memory only. A `TaskManager` class holds a `Map<number, Task>`. No file I/O.
- **Async vs sync:** Synchronous only — no I/O, no timers, no external APIs involved.
- **Validation:** Manual type guard / inline check on title (trim + length). No external validation library needed for a single field.
- **Data modeling:** Plain `interface Task` with `readonly` fields where data is set at creation and not mutated structurally. `completed` is the only mutable field.
