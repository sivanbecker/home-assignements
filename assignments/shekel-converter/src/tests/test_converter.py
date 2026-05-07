import pytest

from ..converter import convert_currency, format_currency, print_result, _validate_inputs


class TestValidateInputs:
    def test_should_raise_type_error_when_amount_is_string(self):
        with pytest.raises(TypeError):
            _validate_inputs("100", 3.5)

    def test_should_raise_type_error_when_rate_is_string(self):
        with pytest.raises(TypeError):
            _validate_inputs(100, "3.5")

    def test_should_raise_type_error_when_amount_is_none(self):
        with pytest.raises(TypeError):
            _validate_inputs(None, 3.5)

    def test_should_raise_type_error_when_rate_is_none(self):
        with pytest.raises(TypeError):
            _validate_inputs(100, None)

    def test_should_raise_value_error_when_amount_is_zero(self):
        with pytest.raises(ValueError):
            _validate_inputs(0, 3.5)

    def test_should_raise_value_error_when_amount_is_negative(self):
        with pytest.raises(ValueError):
            _validate_inputs(-100, 3.5)

    def test_should_raise_value_error_when_rate_is_zero(self):
        with pytest.raises(ValueError):
            _validate_inputs(100, 0)

    def test_should_raise_value_error_when_rate_is_negative(self):
        with pytest.raises(ValueError):
            _validate_inputs(100, -3.5)

    def test_should_pass_when_inputs_are_valid_floats(self):
        _validate_inputs(100.5, 3.5)

    def test_should_pass_when_inputs_are_valid_ints(self):
        _validate_inputs(100, 3)


class TestConvertCurrency:
    def test_should_return_converted_amount(self):
        result = convert_currency(100, 3.5)
        assert result == 350.0

    def test_should_handle_float_amounts(self):
        result = convert_currency(50.5, 2.0)
        assert result == 101.0

    def test_should_handle_float_rates(self):
        result = convert_currency(100, 3.75)
        assert result == 375.0

    def test_should_return_float_even_with_int_inputs(self):
        result = convert_currency(100, 3)
        assert isinstance(result, float)
        assert result == 300.0


class TestFormatCurrency:
    def test_should_format_to_two_decimal_places(self):
        result = format_currency(123.456)
        assert result == "123.46"

    def test_should_format_whole_number_with_decimals(self):
        result = format_currency(100.0)
        assert result == "100.00"

    def test_should_round_down(self):
        result = format_currency(123.454)
        assert result == "123.45"

    def test_should_round_up(self):
        result = format_currency(123.456)
        assert result == "123.46"

    def test_should_accept_custom_decimal_places(self):
        result = format_currency(123.456, decimal_places=3)
        assert result == "123.456"

    def test_should_handle_small_numbers(self):
        result = format_currency(0.1)
        assert result == "0.10"


class TestPrintResult:
    def test_should_print_formatted_value(self, capsys):
        print_result("123.45")
        captured = capsys.readouterr()
        assert "123.45" in captured.out
