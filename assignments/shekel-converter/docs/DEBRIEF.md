# Shekel Converter - Debrief

## Per-Module Explanation

### `converter.py`
Single module with four focused functions:

#### `_validate_inputs(amount, rate)`
- Guards against invalid input types (non-numeric) with `isinstance` checks
- Explicitly rejects `bool` type (since `isinstance(True, int)` is True in Python)
- Validates ranges: amount > 0, rate > 0
- Raises `TypeError` for type violations, `ValueError` for range violations
- Provides clear error messages with type names

#### `convert_currency(amount, rate)`
- Pure function: no side effects, no validation (assumes pre-validated inputs)
- Single line of logic: `amount * rate`
- Returns `float` to ensure consistent type even with int inputs
- Suitable for high-volume conversions once inputs are validated

#### `format_currency(value, decimal_places=2)`
- Uses Python's f-string formatting syntax: `f"{value:.{decimal_places}f}"`
- Handles rounding automatically via Python's default banker's rounding
- Flexible: customizable decimal places via parameter
- Returns string representation ready for display or storage

#### `print_result(formatted_value)`
- Simple I/O wrapper: prints the formatted value
- Separates concerns: printing logic is decoupled from conversion/formatting
- Easy to stub/mock in tests, easy to replace with file I/O or logging if needed

## Patterns Used

### Separation of Concerns
- **Validation:** Input checking is isolated in `_validate_inputs`
- **Computation:** Pure conversion logic in `convert_currency`
- **Formatting:** Presentation logic in `format_currency`
- **I/O:** Output in `print_result`

Each function has one reason to change, making the code maintainable and testable.

### Fail-Fast
Validation happens before any computation. Invalid inputs raise exceptions immediately, preventing silent failures or incorrect results propagating downstream.

### Type Hints
All function signatures include type annotations (`float | int`, `-> float`, etc.), which:
- Clarify intent and usage
- Enable IDE autocomplete and error detection
- Document expected behavior without comments

## Tradeoffs & Decisions

### Why not a single `convert_and_print()` function?
Combining operations violates the Single Responsibility Principle. Separating them allows:
- Testing conversion logic without capturing stdout
- Reusing conversion in non-printing contexts
- Swapping output methods (stdout, file, logging, API) without changing converter

### Why manual `isinstance` checks instead of pydantic?
For a single-value validation scenario, pydantic overhead is unnecessary. Manual checks are:
- Zero dependencies (stdlib-only)
- Immediately obvious to any Python reader
- Sufficient for simple type + range checks

### Why explicit `bool` rejection?
Python's type system has a quirk: `isinstance(True, int)` returns True because `bool` is a subclass of `int`. Explicitly rejecting it prevents silent acceptance of `amount=True` or `rate=False`.

### Why return float from convert_currency?
Ensures consistent return type regardless of input types. `100 * 3` (int) vs `100.0 * 3` (float) both return `float`.

## What I'd Change With More Time

1. **Add integration function** — A `convert_and_print_currency(amount, rate)` wrapper that chains the four functions in order, handling validation → conversion → formatting → printing in one call.

2. **Add logging** — Replace/supplement `print_result` with structured logging using Python's `logging` module for better control over output destination and format.

3. **Support multiple currencies** — Extend `format_currency` to accept currency codes (USD, EUR) and format with currency symbols (e.g., "$123.45", "€123,45").

4. **Error handling in print_result** — Add try-catch around the print statement to handle rare I/O failures gracefully.

5. **Documentation** — Add docstrings to each function explaining inputs, outputs, and error conditions. Type hints provide some documentation, but explicit docstrings are valuable for complex behavior.

## Test Coverage

21 tests covering:
- **Validation:** 10 tests (type errors, value errors, valid inputs)
- **Conversion:** 4 tests (basic conversion, float/int handling, return type)
- **Formatting:** 6 tests (decimal places, rounding, custom precision, small numbers)
- **Printing:** 1 test (stdout capture)

All tests pass. Code is linted clean (`ruff check`).
