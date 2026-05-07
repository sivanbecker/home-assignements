# Engineering Standards & Decision Reference

This file captures recurring technical decisions with their tradeoffs.
Before designing any solution, Claude reads this file and recommends the
appropriate option for the current context. The confirmed choice is logged
in the per-assignment `docs/DECISIONS.md`.

---

## Universal Questions Checklist

Always include applicable questions from this list in `docs/QUESTIONS.md` during intake.

### Complexity & Scale
- What is the expected input size / volume?
- Are there memory constraints?
- Are there latency or throughput requirements?
- Should the solution optimize for time, space, or readability — or balance all three?

### Correctness & Edge Cases
- How should invalid input be handled — raise exception, return sentinel value, or silently ignore?
- Are there numeric edge cases to handle — zero, negative numbers, float precision, overflow?
- Is the input guaranteed to be non-empty, or must empty input be handled?
- Are there ordering guarantees on the input, or must the solution handle arbitrary order?

### Concurrency
- Will this run single-threaded, or could it be called concurrently?
- Is shared state involved?

### Persistence
- Should any state survive between calls or runs?
- Is there a storage format requirement (file, db, in-memory only)?

### Output
- Is there an exact output format required (rounding, sorting, structure, encoding)?
- Should errors be surfaced to the caller or logged silently?

---

## Input Validation

### Options

#### 1. `pydantic`
**Best for:** structured data with multiple fields, API boundaries, complex validation rules

**Pros:**
- Declarative and readable
- Rich error messages out of the box
- Integrates with type hints natively
- Industry standard — signals modern Python knowledge

**Cons:**
- External dependency
- Overhead for simple single-value validation
- Can feel heavy for pure algorithm assignments

#### 2. `dataclass` with `__post_init__`
**Best for:** simple structured data, stdlib-only constraint, lightweight models

**Pros:**
- No external dependency
- Clean and Pythonic
- Good fit when you already need a dataclass for data modeling

**Cons:**
- Validation logic is manual — no built-in type coercion
- Error messages require effort to make informative
- Doesn't scale well with complex nested validation

#### 3. Manual `isinstance` guards
**Best for:** single-value validation, algorithm-focused assignments where validation is a minor concern

**Pros:**
- Zero dependencies
- Immediately obvious to any Python reader
- Fine for simple type + range checks

**Cons:**
- Verbose and repetitive with multiple fields
- Easy to miss edge cases (e.g. `bool` is a subclass of `int`)
- Doesn't scale

---

## Error Handling

### Options

#### 1. Custom exception classes
**Best for:** domain logic with meaningful error categories, when callers need to distinguish error types

**Pros:**
- Clear domain language (`InvalidAmountError` vs generic `ValueError`)
- Easy to catch specific errors upstream
- Good for debrief — shows intentional design

**Cons:**
- More boilerplate
- Overkill if errors are never caught differently

#### 2. Built-in exceptions (`ValueError`, `TypeError`)
**Best for:** simple scripts, algorithm assignments, when error type distinction doesn't matter

**Pros:**
- Zero boilerplate
- Universally understood
- Sufficient for most home assignments

**Cons:**
- Less expressive domain language
- All errors look the same to the caller

#### 3. Result type / `Either` pattern
**Best for:** functional style, when you want to avoid exceptions entirely

**Pros:**
- Explicit error handling at every call site
- No hidden control flow

**Cons:**
- Not idiomatic Python
- Unfamiliar to many reviewers — needs justification

---

## Data Modeling

### Options

#### 1. `pydantic` models
See Input Validation → pydantic. Same tradeoffs apply.

#### 2. `dataclass`
**Best for:** plain data containers, no validation needed, stdlib-only

**Pros:**
- Clean, readable
- `__repr__`, `__eq__` for free
- Lightweight

**Cons:**
- No validation built in
- Less powerful than pydantic for complex shapes

#### 3. Plain `dict`
**Best for:** quick prototyping, passing data between functions internally

**Pros:**
- Zero overhead
- Flexible

**Cons:**
- No type safety
- No self-documentation
- Hard to refactor

---

## CLI Interface (if needed)

### Options

#### 1. `argparse` (stdlib)
**Best for:** simple CLIs, no external dependency preference

#### 2. `typer`
**Best for:** modern CLI with type hint integration, auto-generated help

**Pros:** clean, Pythonic, built on pydantic
**Cons:** external dependency

#### 3. `click`
**Best for:** complex CLIs, widely known in industry

---

## Async vs Sync

### Options

#### 1. Synchronous (default)
**Best for:** most home assignments, CPU-bound work, no I/O concurrency needed

**Pros:** simple, predictable, easy to test
**Cons:** blocks on I/O

#### 2. `asyncio`
**Best for:** I/O-bound tasks, multiple concurrent operations (e.g. fetching URLs)

**Pros:** non-blocking, scales well for I/O
**Cons:** complexity creep, testing requires async-aware tools (`pytest-asyncio`)

---

## Logging Strategy

### Options

#### 1. No logging (default for assignments)
**Best for:** pure algorithm problems, short-lived scripts

#### 2. `logging` stdlib
**Best for:** any assignment with meaningful runtime state or error paths worth tracing

**Pros:** stdlib, configurable levels, no dependencies
**Cons:** boilerplate setup

#### 3. `loguru`
**Best for:** when readable logs matter and external deps are allowed

**Pros:** zero config, beautiful output, easy file rotation
**Cons:** external dependency

---

## Testing Patterns

### Options

#### 1. Plain `pytest` functions (default)
**Best for:** most cases — fast, readable, minimal boilerplate

#### 2. Parametrize (`@pytest.mark.parametrize`)
**Best for:** same logic tested across many input/output pairs

**Pros:** DRY, scales well, clear failure messages
**Cons:** can obscure intent if overused

#### 3. Fixtures
**Best for:** shared setup (e.g. a pre-built object used across many tests)

**Pros:** reusable, clean separation of setup and assertion
**Cons:** indirection can make tests harder to read in isolation

#### 4. Mocking (`unittest.mock` or `pytest-mock`)
**Best for:** isolating units from external dependencies (I/O, APIs, time)

**Pros:** true unit isolation
**Cons:** mocks can drift from real behaviour — use sparingly

---
