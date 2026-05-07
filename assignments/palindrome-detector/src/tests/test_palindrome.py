import pytest

from ..palindrome import is_palindrome


class TestValidation:
    def test_should_raise_type_error_when_input_is_not_string(self):
        with pytest.raises(TypeError):
            is_palindrome(123)

    def test_should_raise_type_error_when_input_is_none(self):
        with pytest.raises(TypeError):
            is_palindrome(None)

    def test_should_raise_value_error_when_input_contains_non_ascii(self):
        with pytest.raises(ValueError):
            is_palindrome("café")

    def test_should_raise_value_error_when_input_contains_emoji(self):
        with pytest.raises(ValueError):
            is_palindrome("hello 😀")

    def test_should_raise_value_error_when_input_only_spaces_and_punctuation(self):
        with pytest.raises(ValueError):
            is_palindrome("   !!! ???")


class TestBasicPalindromes:
    @pytest.mark.parametrize("text,expected", [
        ("a", True),
        ("aa", True),
        ("aba", True),
        ("racecar", True),
        ("12321", True),
        ("A", True),
    ])
    def test_should_return_true_for_simple_palindromes(self, text, expected):
        assert is_palindrome(text) == expected

    @pytest.mark.parametrize("text,expected", [
        ("ab", False),
        ("abc", False),
        ("hello", False),
        ("123", False),
    ])
    def test_should_return_false_for_non_palindromes(self, text, expected):
        assert is_palindrome(text) == expected


class TestIgnoreCaseAndSpaces:
    @pytest.mark.parametrize("text,expected", [
        ("Racecar", True),
        ("Race Car", True),
        ("A B A", True),
        ("Was it a car or a cat I saw?", True),
    ])
    def test_should_ignore_case_and_spaces(self, text, expected):
        assert is_palindrome(text) == expected


class TestIgnorePunctuation:
    @pytest.mark.parametrize("text,expected", [
        ("A man, a plan, a canal: Panama", True),
        ("race-car", True),
        ("a.b.a", True),
        ("a!b!a", True),
        ("hello, world", False),
    ])
    def test_should_ignore_punctuation(self, text, expected):
        assert is_palindrome(text) == expected


class TestEdgeCases:
    def test_should_return_true_for_empty_string(self):
        assert is_palindrome("") is True

    def test_should_handle_single_character(self):
        assert is_palindrome("x") is True

    def test_should_handle_mixed_case_and_punctuation(self):
        assert is_palindrome("A1b2B1a") is True

    def test_should_handle_multiple_spaces(self):
        assert is_palindrome("a  b  a") is True

    def test_should_handle_all_punctuation_types(self):
        assert is_palindrome("A-b,c.d:e;f!g?h(i)j[k]l{m}n'o\"p@q#r$s%t&u*v+w=x") is False

    def test_should_handle_numbers_and_letters_mixed(self):
        assert is_palindrome("1a2b2a1") is True
