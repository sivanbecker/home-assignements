# Decisions: Working Hours Calculator

## Confirmed Technical Choices

### Decision 1: Input Validation
**Choice:** Manual `isinstance` guards

**Rationale:**
- Simple single-value validation (two strings)
- Zero dependencies
- Fast execution (200ms latency target)
- Straightforward logic: format check (HH:MM) + range check (hours 0-23, minutes 0-59)

**Implementation:**
```python
# Validate format: HH:MM
# Validate ranges: hours [0,23], minutes [0,59]
# Raise ValueError if invalid
```

---

### Decision 2: Error Handling
**Choice:** Built-in `ValueError` exception

**Rationale:**
- Requirements explicitly specify `ValueError`
- Caller doesn't need to distinguish error types
- Standard Python convention
- Simplest approach

**Implementation:**
- Raise `ValueError` with descriptive message for all validation failures
- No custom exception classes needed

---

### Decision 3: Data Modeling
**Choice:** No intermediate model — parse directly in function

**Rationale:**
- Input: two strings, Output: one float
- No domain object needed
- Minimal object allocation → faster execution
- Simplifies testing and reduces indirection

**Implementation:**
```python
def calculate_shift_duration(start_time: str, end_time: str) -> float:
    # Parse and validate inline
    # Calculate and return float
```

---

### Decision 4: Testing Patterns
**Choice:** `@pytest.mark.parametrize` for test cases

**Rationale:**
- Many test cases with different inputs/outputs:
  - Standard shifts (09:00 → 17:00)
  - Minute precision (09:00 → 10:15)
  - Midnight crossing (22:00 → 02:00)
  - Edge case (same time → 24 hours)
  - Invalid format cases (multiple scenarios)
- DRY and maintainable
- Clear failure messages per case

**Implementation:**
```python
@pytest.mark.parametrize("start,end,expected", [
    ("09:00", "17:00", 8.0),
    ("09:00", "10:15", 1.25),
    # ... more cases
])
def test_calculate_shift_duration(start, end, expected):
    assert calculate_shift_duration(start, end) == expected
```

---

## Design Constraints

- **Performance**: Stateless, fast execution (no caching needed)
- **Validation**: Format + semantic violations → ValueError
- **Rounding**: 2 decimal places
- **Latency**: Must complete in ≤ 200ms
- **Scale**: Designed for batch processing (millions of calls)
