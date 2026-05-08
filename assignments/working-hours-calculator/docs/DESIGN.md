# Design: Working Hours Calculator

## Overview

A simple, stateless function that parses two 24-hour time strings and returns the duration in decimal hours. No domain objects or complex data structures—just direct calculation.

## Public Function Signature

```python
def calculate_shift_duration(start_time: str, end_time: str) -> float:
    """
    Calculate the duration of a work shift in decimal hours.
    
    Args:
        start_time: Start time in HH:MM format (e.g., "09:00")
        end_time: End time in HH:MM format (e.g., "17:00")
    
    Returns:
        Duration in decimal hours (e.g., 8.5)
    
    Raises:
        ValueError: If time format or values are invalid
    
    Examples:
        >>> calculate_shift_duration("09:00", "17:00")
        8.0
        >>> calculate_shift_duration("09:00", "10:15")
        1.25
        >>> calculate_shift_duration("22:00", "02:00")
        4.0
    """
```

## Private Helper Functions

### `_validate_time_format(time_str: str) -> None`
Validates that a time string is exactly in HH:MM format.

**Logic:**
- Check string length is 5
- Check character at index 2 is ":"
- Check indices [0:2] and [3:5] are numeric digits

**Raises:** `ValueError` if format is invalid

---

### `_parse_time(time_str: str) -> tuple[int, int]`
Parses a validated time string into hours and minutes.

**Input:** Time string in HH:MM format (assumed valid from `_validate_time_format`)

**Output:** `(hour: int, minute: int)`

**Logic:**
- Extract substring [0:2] and convert to int
- Extract substring [3:5] and convert to int
- Return tuple

---

### `_validate_time_ranges(hour: int, minute: int) -> None`
Validates that hour and minute are in valid ranges.

**Logic:**
- Check hour: 0 ≤ hour ≤ 23
- Check minute: 0 ≤ minute ≤ 59

**Raises:** `ValueError` if out of range

---

### `_time_to_minutes(hour: int, minute: int) -> int`
Converts hours and minutes to total minutes since midnight.

**Formula:** `total_minutes = hour * 60 + minute`

**Example:** `_time_to_minutes(9, 30)` → `570`

---

### `_handle_midnight_crossing(start_min: int, end_min: int) -> int`
Adjusts end time if it crosses midnight (end < start).

**Logic:**
- If `end_min < start_min`: add 24 * 60 (1440 minutes) to `end_min`
- If `end_min == start_min`: return special value `1440` (24 hours)
- Otherwise: return `end_min` unchanged

**Returns:** Adjusted end time in minutes

---

### `_calculate_duration(start_min: int, end_min: int) -> int`
Calculates duration in minutes.

**Logic:**
- `duration_minutes = end_min - start_min` (end_min is pre-adjusted for midnight)

**Returns:** Duration in minutes

---

### `_round_to_two_decimals(hours: float) -> float`
Rounds duration to 2 decimal places.

**Logic:**
- `round(hours, 2)`

**Returns:** Rounded float

---

## Algorithm Flow

```
Input: start_time="09:00", end_time="17:00"
  ↓
_validate_time_format("09:00")              → None (or ValueError)
_validate_time_format("17:00")              → None (or ValueError)
  ↓
start_h, start_m = _parse_time("09:00")     → (9, 0)
end_h, end_m = _parse_time("17:00")         → (17, 0)
  ↓
_validate_time_ranges(9, 0)                 → None (or ValueError)
_validate_time_ranges(17, 0)                → None (or ValueError)
  ↓
start_min = _time_to_minutes(9, 0)          → 540
end_min = _time_to_minutes(17, 0)           → 1020
  ↓
end_min = _handle_midnight_crossing(540, 1020) → 1020
  ↓
duration_min = _calculate_duration(540, 1020)  → 480
  ↓
duration_hours = 480 / 60                   → 8.0
  ↓
result = _round_to_two_decimals(8.0)        → 8.0
  ↓
Output: 8.0
```

## Module Structure

Single module file: `src/shift_calculator.py`

```python
src/
├── __init__.py
├── shift_calculator.py          # Public function + private helpers
└── tests/
    ├── __init__.py
    └── test_shift_calculator.py # Tests only public API (parametrized)
```

### Organization
- **Public function**: `calculate_shift_duration()`
- **Private helpers**: `_validate_time_format()`, `_parse_time()`, `_validate_time_ranges()`, `_time_to_minutes()`, `_handle_midnight_crossing()`, `_calculate_duration()`, `_round_to_two_decimals()`
- **Tests**: Only test the public function; implementation details are private concerns

### Benefits of this design
1. **Separation of concerns**: Each function has a single responsibility
2. **Maintainability**: Easy to understand and modify individual steps
3. **Testability**: Functions can be read and understood in isolation (though only public API is tested)
4. **Readability**: Main function becomes a clear pipeline of steps
5. **Extensibility**: Easy to add logging, monitoring, or caching to specific stages later

## Error Cases

| Case | Error | Message |
|------|-------|---------|
| Format: "9:00" | ValueError | "Invalid time format. Expected HH:MM" |
| Format: "09:0" | ValueError | "Invalid time format. Expected HH:MM" |
| Hour > 23 | ValueError | "Hour must be 0-23, got XX" |
| Minute > 59 | ValueError | "Minute must be 0-59, got XX" |
| Non-numeric | ValueError | "Time must contain only digits and colon" |

## Performance Considerations

- **Time complexity**: O(1) — constant time, no loops (even with helper functions)
- **Space complexity**: O(1) — only scalar variables
- **Execution**: Should complete well under 200ms latency target
- **Helper function overhead**: Negligible compared to I/O costs; design prioritizes clarity
- **No I/O, no dependencies** → highly predictable performance
- **Private functions**: Zero runtime overhead compared to inline code (standard function call cost)

## Edge Cases Handled

1. **Midnight crossing**: 22:00 → 02:00 = 4.0 hours ✓
2. **Same time**: 09:00 → 09:00 = 24.0 hours ✓
3. **Minutes precision**: 09:00 → 10:15 = 1.25 hours ✓
4. **Start of day**: 00:00 → 08:00 = 8.0 hours ✓
5. **End of day**: 22:00 → 00:00 = 2.0 hours ✓
6. **Invalid format**: Raises ValueError ✓
7. **Invalid ranges**: Raises ValueError ✓

## Validation Strategy

Format validation happens first, before range checks. This way:
- Malformed strings are caught early
- No risk of crashes from non-numeric data
- Clear error messages for debugging
