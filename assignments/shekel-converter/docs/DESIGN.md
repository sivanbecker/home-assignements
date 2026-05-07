# Shekel Converter - Design

## Domain Concepts
- **Currency Conversion:** Transform an amount in ILS to another currency using an exchange rate
- **Exchange Rate:** Multiplier that scales the input amount to output currency
- **Validation:** Ensure inputs are numeric, positive, and non-zero before conversion

## Module Breakdown

### `converter.py`
Four separate functions, each with a single responsibility:

#### 1. `_validate_inputs(amount: float | int, rate: float | int) -> None`
- **Purpose:** Validate input types and ranges
- **Validation:**
  - Check `amount` is `int` or `float` → raise `TypeError` if not
  - Check `rate` is `int` or `float` → raise `TypeError` if not
  - Check `amount` > 0 → raise `ValueError` if not
  - Check `rate` > 0 → raise `ValueError` if not
- **Returns:** None (raises exception on failure)

#### 2. `convert_currency(amount: float | int, rate: float | int) -> float`
- **Purpose:** Convert ILS amount to target currency using exchange rate
- **Precondition:** Inputs must be validated before calling
- **Logic:** Return `amount * rate`
- **Returns:** float (unformatted result)

#### 3. `format_currency(value: float, decimal_places: int = 2) -> str`
- **Purpose:** Format numeric value to specified decimal places
- **Logic:** Return string formatted to N decimal places
- **Returns:** Formatted string (e.g., "123.45")

#### 4. `print_result(formatted_value: str) -> None`
- **Purpose:** Print the formatted result to console
- **Logic:** Print the provided string
- **Returns:** None

## Data Flow

```
Input: amount (numeric), rate (numeric)
  ↓
_validate_inputs(amount, rate)
  ↓ (fail → TypeError/ValueError)
result = convert_currency(amount, rate)
  ↓
formatted = format_currency(result)
  ↓
print_result(formatted)
```

## Design Patterns & Rationale
- **Separation of Concerns:** Each function has one responsibility
  - Validation: guards against invalid inputs
  - Conversion: pure calculation logic
  - Formatting: presentation logic
  - Printing: I/O logic
- **Composability:** Functions can be used independently or chained
- **Testability:** Each concern can be tested in isolation
- **Type Hints:** Full annotations for clarity and IDE support

## Edge Cases Handled
- Non-numeric inputs → `TypeError`
- Zero or negative amount → `ValueError`
- Zero or negative rate → `ValueError`
- Float precision → Python's native float arithmetic (sufficient for 2 decimal place display)
