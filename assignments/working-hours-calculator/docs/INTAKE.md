# Intake: Working Hours Calculator

## Requirements

Parse and calculate the duration of work shifts in decimal hours, accounting for midnight crossings and format validation.

### Core Function
```python
def calculate_shift_duration(start_time: str, end_time: str) -> float
```

### Input Format
- Two strings in 24-hour format: `HH:MM` (e.g., "09:00", "17:30")
- Both must be zero-padded (09:00 valid, 9:00 invalid)

### Output
- Float representing total hours worked
- Precision: hundredths (e.g., 1.25 for 1 hour 15 minutes)

## Constraints

### Format Validation
- Must raise `ValueError` for invalid formats:
  - Missing zero-padding (e.g., "9:00" instead of "09:00")
  - Invalid hour values (e.g., "25:00", "-01:00")
  - Invalid minute values (e.g., "09:60", "09:-5")
  - Malformed strings (e.g., "9-00", "9", "09:00:00")

### Time Handling
1. **Standard shift**: start_time < end_time (same day)
   - Example: 09:00 → 17:00 = 8.0 hours
2. **Midnight crossing**: end_time < start_time (end time next day)
   - Example: 22:00 → 02:00 = 4.0 hours
3. **Edge case**: start_time == end_time (unclear if 0.0 or 24.0 hours)

## Test Cases (Given)

1. `("09:00", "17:00")` → `8.0`
2. `("09:00", "10:15")` → `1.25`
3. `("22:00", "02:00")` → `4.0`
4. Invalid formats → `ValueError`

## Out of Scope

- Breaks or lunch periods (not mentioned in requirements)
- Daylight saving time
- Different time zones
- Working days vs calendar days
- Shift duration validation (e.g., max 24 hours)
