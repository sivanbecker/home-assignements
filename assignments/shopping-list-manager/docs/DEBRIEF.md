# Shopping List Manager - Debrief

## Overview
Completed a fully functional shopping list manager CLI application with 36 comprehensive tests covering domain logic and user interaction. All requirements, constraints, and edge cases from QUESTIONS.md are addressed.

---

## Module Breakdown

### `src/shopping_list.py`
**Core domain logic:**
- `ShoppingList` aggregate root managing inventory via `dict[str, float]`
- `Item` dataclass for clear domain representation
- Custom exception hierarchy: `InvalidPriceError`, `InvalidItemNameError`, `ItemNotFoundError`, `InvalidInputError`
- `_normalize_name()` for case-insensitive, whitespace-tolerant lookups

**Key Design:**
- O(1) dictionary-based storage enables 100k items comfortably within 100–200ms latency targets
- Validation at entry points (add_item) prevents invalid state
- No persistence layer (in-memory only, per assignment)

**Test Coverage:** 23 tests across add, remove, view, total, and edge cases

### `src/cli.py`
**User interaction:**
- REPL loop displaying menu and dispatching to ShoppingList methods
- `_add_item()`, `_remove_item()`, `_view_items()`, `_view_total()` command handlers
- Exception handling with stderr output matching format requirement: `Error: <message>`
- Graceful retry on invalid input (don't exit)

**Key Design:**
- Separation of concerns: CLI handles I/O and user experience, ShoppingList handles business logic
- All user input parsed and validated before passing to domain layer
- Error context preserved in exception messages for user feedback

**Test Coverage:** 13 tests covering menu navigation, item operations, error handling, and recovery

### `src/main.py`
Simple entry point instantiating CLI and running the REPL loop.

---

## Patterns & Decisions

### Domain-Driven Design (DDD)
ShoppingList is the aggregate root with clear invariants:
- Item names are non-empty (after stripping)
- Prices are non-negative floats
- Lookups are case-insensitive

Exceptions form domain language (InvalidPriceError vs generic ValueError) improving readability.

### Manual Input Validation
Chose `isinstance` guards + range checks over pydantic/dataclass validators:
- Zero dependencies (already required none)
- Lightweight for single values
- Clear to any reader

### Custom Exceptions
Chose domain-specific over built-in exceptions:
- Callers (CLI) can distinguish error types and respond appropriately
- Clearer domain language in code
- Exception messages directly used in stderr output per spec

### Dictionary for Inventory
Chose `dict[str, float]` over list/set:
- O(1) add/remove/lookup (vs O(n) for linear searches)
- Natural case-insensitive keying via `_normalize_name()`
- Supports efficient total cost calculation (`sum()`)

### Testing Strategy
Used pytest with:
- Test classes grouping related behavior
- Descriptive test names describing behavior, not implementation
- Parametrization avoided (test cases are simple/specific, not repetitive)
- Fixtures for shared CLI setup

---

## Tradeoffs & Constraints

### What We Did Well
- **Validation at boundary**: CLI input validation prevents invalid state at domain layer
- **Case-insensitive normalization**: Single point of truth in `_normalize_name()`
- **Error recovery**: Invalid input doesn't break REPL, user retries naturally
- **Performance**: O(1) operations scale to 100k items well within latency target

### What Could Change with More Time
1. **Persistence**: Add SQLite/file storage to survive restarts (currently in-memory only)
2. **Quantity tracking**: Current design is price-per-item; could add quantities if needed
3. **Undo/history**: Keep a stack of operations for rollback (nice-to-have)
4. **Rich TUI**: Replace text menu with prompt-toolkit or curses for better UX
5. **Decimal handling**: Use `decimal.Decimal` for exact currency math vs float (avoids rounding artifacts)
6. **Concurrency**: Add thread-safe locking if ShoppingList is called from multiple threads

### Known Limitations
- No persistence; state lost on exit
- No quantity per item; only price
- Float prices (not Decimal); may have rounding artifacts for many operations
- Single-threaded only
- No undo; deletions are permanent

---

## Code Quality

- **Type hints**: All function signatures include types
- **Error handling**: Custom exceptions with descriptive messages
- **Testing**: 36 tests (23 domain + 13 CLI) cover happy path, edge cases, error conditions
- **Linting**: Zero ruff violations
- **Separation of concerns**: Domain logic isolated from I/O

---

## Lessons & Insights

1. **TDD Discipline**: Writing tests first forced clear thinking about requirements (e.g., case-insensitive names, error formats). Refactoring after all tests passed kept implementation minimal.

2. **Custom Exceptions as Documentation**: Domain-specific exception names (`InvalidPriceError` vs `ValueError`) make code intent clear and testing precise.

3. **Dictionary Simplicity**: Using a dict for O(1) operations beat overthinking with more complex data structures. Performance was never a concern at this scale.

4. **CLI Testing Challenge**: Mocking `input()` and `sys.stdout`/`sys.stderr` was key to testing user interaction without manual input; reflects real CLI engineering practices.

5. **Case Normalization**: Centralizing case-insensitivity in `_normalize_name()` avoids subtle bugs from scattered string transformations.

---

## Summary

Delivered a clean, well-tested shopping list manager following TDD principles. Domain logic is isolated, user interaction is graceful, and all requirements from QUESTIONS.md are addressed. The codebase is maintainable, extensible (persistence, undo, richer UI are natural next steps), and performant for the expected scale.
