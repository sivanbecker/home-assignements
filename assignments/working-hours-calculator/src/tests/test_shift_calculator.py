import pytest
from src.shift_calculator import calculate_shift_duration


class TestCalculateShiftDuration:
    """Test suite for shift duration calculation."""

    # Standard cases and minute precision
    @pytest.mark.parametrize("start,end,expected", [
        ("09:00", "17:00", 8.0),
        ("09:00", "10:15", 1.25),
        ("22:00", "02:00", 4.0),
        ("00:00", "08:00", 8.0),
        ("22:00", "00:00", 2.0),
        ("09:00", "09:00", 24.0),
    ])
    def test_valid_shifts_return_correct_duration(self, start, end, expected):
        """Test standard shifts and edge cases."""
        assert calculate_shift_duration(start, end) == expected

    # Minute precision
    @pytest.mark.parametrize("start,end,expected", [
        ("09:00", "09:30", 0.5),
        ("09:00", "09:15", 0.25),
        ("09:00", "09:45", 0.75),
        ("10:30", "11:45", 1.25),
        ("14:20", "18:50", 4.5),
    ])
    def test_minute_precision(self, start, end, expected):
        """Test shifts with various minute combinations."""
        assert calculate_shift_duration(start, end) == expected

    # Rounding to 2 decimal places
    @pytest.mark.parametrize("start,end,expected", [
        ("09:00", "09:01", 0.02),
        ("09:00", "09:03", 0.05),
        ("09:00", "09:07", 0.12),
        ("09:00", "09:11", 0.18),
    ])
    def test_rounding_to_two_decimal_places(self, start, end, expected):
        """Test that results are rounded to 2 decimal places."""
        assert calculate_shift_duration(start, end) == expected

    # Invalid format cases
    @pytest.mark.parametrize("invalid_input", [
        ("9:00", "17:00"),         # Missing zero-padding
        ("09:0", "17:00"),         # Missing digit
        ("9:00:00", "17:00"),      # Extra segment
        ("09-00", "17:00"),        # Wrong delimiter
        ("0900", "17:00"),         # No delimiter
        ("", "17:00"),             # Empty string
        ("ab:cd", "17:00"),        # Non-numeric
    ])
    def test_invalid_format_raises_value_error(self, invalid_input):
        """Test that invalid time formats raise ValueError."""
        with pytest.raises(ValueError):
            calculate_shift_duration(invalid_input, "17:00")

    # Invalid hour/minute ranges
    @pytest.mark.parametrize("invalid_input", [
        ("25:00", "17:00"),        # Hour > 23
        ("24:00", "17:00"),        # Hour = 24
        ("-01:00", "17:00"),       # Negative hour
        ("09:60", "17:00"),        # Minute > 59
        ("09:-5", "17:00"),        # Negative minute
    ])
    def test_invalid_ranges_raises_value_error(self, invalid_input):
        """Test that out-of-range hour/minute values raise ValueError."""
        with pytest.raises(ValueError):
            calculate_shift_duration(invalid_input, "17:00")

    # Boundary values
    @pytest.mark.parametrize("start,end,expected", [
        ("00:00", "00:00", 24.0),  # Midnight to midnight
        ("23:59", "23:59", 24.0),  # Last minute to last minute
        ("00:00", "23:59", 23.98), # Almost 24 hours (1439 minutes)
        ("23:59", "00:00", 0.02),  # 1 minute shift crossing midnight
    ])
    def test_boundary_cases(self, start, end, expected):
        """Test boundary values like midnight and end-of-day."""
        assert calculate_shift_duration(start, end) == expected
