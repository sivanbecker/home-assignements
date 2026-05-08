def _validate_time_format(time_str: str) -> None:
    """Validate that time string is in HH:MM format."""
    if not isinstance(time_str, str) or len(time_str) != 5:
        raise ValueError("Invalid time format. Expected HH:MM")
    if time_str[2] != ":":
        raise ValueError("Invalid time format. Expected HH:MM")
    if not (time_str[0:2].isdigit() and time_str[3:5].isdigit()):
        raise ValueError("Invalid time format. Expected HH:MM")


def _parse_time(time_str: str) -> tuple[int, int]:
    """Parse time string into hours and minutes."""
    hour = int(time_str[0:2])
    minute = int(time_str[3:5])
    return hour, minute


def _validate_time_ranges(hour: int, minute: int) -> None:
    """Validate that hour and minute are in valid ranges."""
    if not (0 <= hour <= 23):
        raise ValueError(f"Hour must be 0-23, got {hour}")
    if not (0 <= minute <= 59):
        raise ValueError(f"Minute must be 0-59, got {minute}")


def _time_to_minutes(hour: int, minute: int) -> int:
    """Convert hours and minutes to total minutes since midnight."""
    return hour * 60 + minute


def _handle_midnight_crossing(start_min: int, end_min: int) -> int:
    """Adjust end time if it crosses midnight."""
    if end_min < start_min:
        return end_min + 24 * 60  # Add 24 hours (1440 minutes)
    return end_min


def _calculate_duration(start_min: int, end_min: int) -> int:
    """Calculate duration in minutes."""
    return end_min - start_min


def _round_to_two_decimals(hours: float) -> float:
    """Round duration to 2 decimal places."""
    return round(hours, 2)


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
    _validate_time_format(start_time)
    _validate_time_format(end_time)

    start_hour, start_minute = _parse_time(start_time)
    end_hour, end_minute = _parse_time(end_time)

    _validate_time_ranges(start_hour, start_minute)
    _validate_time_ranges(end_hour, end_minute)

    start_min = _time_to_minutes(start_hour, start_minute)
    end_min = _time_to_minutes(end_hour, end_minute)

    if start_min == end_min:
        return 24.0

    end_min = _handle_midnight_crossing(start_min, end_min)
    duration_min = _calculate_duration(start_min, end_min)
    duration_hours = duration_min / 60

    return _round_to_two_decimals(duration_hours)
