# Engineering Standards & Decision Reference

This file captures recurring technical decisions with their tradeoffs.
Before designing any solution, Claude reads this file and recommends the
appropriate option for the current context. The confirmed choice is logged
in the per-assignment `DECISIONS.md`.

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
- See validation section above — same tradeoffs apply

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
## future areas to add: 

## async vs sync 
## logging strategy
## persistence (if any)
## testing patterns beyond the basics
