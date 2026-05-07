import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from shopping_list import (
    ShoppingList,
    InvalidPriceError,
    InvalidItemNameError,
    ItemNotFoundError,
)


class TestAddItem:
    def test_should_add_item_with_valid_name_and_price(self):
        sl = ShoppingList()
        sl.add_item("apple", 1.50)
        items = sl.get_items()
        assert len(items) == 1
        assert items[0].name == "apple"
        assert items[0].price == 1.50

    def test_should_update_price_when_adding_duplicate_item(self):
        sl = ShoppingList()
        sl.add_item("apple", 1.50)
        sl.add_item("apple", 2.00)
        items = sl.get_items()
        assert len(items) == 1
        assert items[0].price == 2.00

    def test_should_handle_case_insensitive_item_names(self):
        sl = ShoppingList()
        sl.add_item("Apple", 1.50)
        sl.add_item("APPLE", 2.00)
        items = sl.get_items()
        assert len(items) == 1
        assert items[0].price == 2.00

    def test_should_reject_empty_item_name(self):
        sl = ShoppingList()
        with pytest.raises(InvalidItemNameError):
            sl.add_item("", 1.50)

    def test_should_reject_whitespace_only_item_name(self):
        sl = ShoppingList()
        with pytest.raises(InvalidItemNameError):
            sl.add_item("   ", 1.50)

    def test_should_reject_negative_price(self):
        sl = ShoppingList()
        with pytest.raises(InvalidPriceError):
            sl.add_item("apple", -1.50)

    def test_should_reject_non_numeric_price(self):
        sl = ShoppingList()
        with pytest.raises(InvalidPriceError):
            sl.add_item("apple", "not_a_number")  # type: ignore

    def test_should_accept_zero_price(self):
        sl = ShoppingList()
        sl.add_item("apple", 0.0)
        items = sl.get_items()
        assert len(items) == 1
        assert items[0].price == 0.0

    def test_should_accept_float_price(self):
        sl = ShoppingList()
        sl.add_item("apple", 1.99)
        items = sl.get_items()
        assert items[0].price == 1.99


class TestRemoveItem:
    def test_should_remove_existing_item(self):
        sl = ShoppingList()
        sl.add_item("apple", 1.50)
        sl.add_item("banana", 0.50)
        sl.remove_item("apple")
        items = sl.get_items()
        assert len(items) == 1
        assert items[0].name == "banana"

    def test_should_raise_error_when_removing_non_existent_item(self):
        sl = ShoppingList()
        with pytest.raises(ItemNotFoundError):
            sl.remove_item("apple")

    def test_should_handle_case_insensitive_remove(self):
        sl = ShoppingList()
        sl.add_item("Apple", 1.50)
        sl.remove_item("APPLE")
        items = sl.get_items()
        assert len(items) == 0


class TestGetItems:
    def test_should_return_empty_list_when_shopping_list_is_empty(self):
        sl = ShoppingList()
        items = sl.get_items()
        assert items == []

    def test_should_return_all_items(self):
        sl = ShoppingList()
        sl.add_item("apple", 1.50)
        sl.add_item("banana", 0.50)
        sl.add_item("orange", 0.75)
        items = sl.get_items()
        assert len(items) == 3
        names = {item.name for item in items}
        assert names == {"apple", "banana", "orange"}


class TestGetTotalCost:
    def test_should_return_zero_when_shopping_list_is_empty(self):
        sl = ShoppingList()
        total = sl.get_total_cost()
        assert total == 0.0

    def test_should_return_sum_of_all_prices(self):
        sl = ShoppingList()
        sl.add_item("apple", 1.50)
        sl.add_item("banana", 0.50)
        sl.add_item("orange", 0.75)
        total = sl.get_total_cost()
        assert total == 2.75

    def test_should_update_total_after_adding_item(self):
        sl = ShoppingList()
        sl.add_item("apple", 1.50)
        assert sl.get_total_cost() == 1.50
        sl.add_item("banana", 0.50)
        assert sl.get_total_cost() == 2.00

    def test_should_update_total_after_removing_item(self):
        sl = ShoppingList()
        sl.add_item("apple", 1.50)
        sl.add_item("banana", 0.50)
        sl.remove_item("apple")
        assert sl.get_total_cost() == 0.50

    def test_should_update_total_when_price_is_updated(self):
        sl = ShoppingList()
        sl.add_item("apple", 1.50)
        assert sl.get_total_cost() == 1.50
        sl.add_item("apple", 2.00)
        assert sl.get_total_cost() == 2.00


class TestClear:
    def test_should_remove_all_items(self):
        sl = ShoppingList()
        sl.add_item("apple", 1.50)
        sl.add_item("banana", 0.50)
        sl.clear()
        items = sl.get_items()
        assert items == []
        assert sl.get_total_cost() == 0.0


class TestNormalizeName:
    def test_should_convert_to_lowercase(self):
        assert ShoppingList._normalize_name("Apple") == "apple"
        assert ShoppingList._normalize_name("APPLE") == "apple"

    def test_should_strip_whitespace(self):
        assert ShoppingList._normalize_name("  apple  ") == "apple"

    def test_should_handle_mixed_case_with_whitespace(self):
        assert ShoppingList._normalize_name("  Apple  ") == "apple"
