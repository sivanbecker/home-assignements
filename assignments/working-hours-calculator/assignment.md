# Assignment: Working Hours Calculator

In many Israeli companies, tracking "Net Working Hours" is essential for payroll, especially when shifts cross midnight or involve specific breaks.

## The Task

Write a function `calculate_shift_duration(start_time, end_time)` that returns the total duration of a shift in decimal hours.

### Inputs
Two strings in 24-hour format (e.g., "09:00", "17:30").

### Output
A float representing the total hours (e.g., 8.5).

### Requirements

1. **Standard Case**: 09:00 to 17:00 should return 8.0.
2. **Minutes Handling**: 09:00 to 10:15 should return 1.25.
3. **Midnight Cross**: If the end_time is earlier than the start_time, assume it refers to the next day. (e.g., 22:00 to 02:00 should return 4.0).
4. **Input Validation**: If the string format is invalid (e.g., "9:00" instead of "09:00" or "25:00"), the function should raise a ValueError.
