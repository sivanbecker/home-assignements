import sys
from io import StringIO
from pathlib import Path
from unittest.mock import patch

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from cli import CLI


class TestCLI:
    @pytest.fixture
    def cli(self):
        return CLI()

    def test_should_display_menu_on_startup(self, cli):
        with patch('builtins.input', side_effect=['5']):
            with patch('sys.stdout', new=StringIO()) as output:
                cli.run()
                output_str = output.getvalue()
                assert "1" in output_str  # Menu option 1
                assert "2" in output_str  # Menu option 2
                assert "5" in output_str  # Exit option

    def test_should_add_item_via_menu(self, cli):
        with patch('builtins.input', side_effect=['1', 'apple', '1.50', '5']):
            with patch('sys.stdout', new=StringIO()):
                cli.run()
                items = cli.shopping_list.get_items()
                assert len(items) == 1
                assert items[0].name == "apple"
                assert items[0].price == 1.50

    def test_should_remove_item_via_menu(self, cli):
        cli.shopping_list.add_item("apple", 1.50)
        with patch('builtins.input', side_effect=['2', 'apple', '5']):
            with patch('sys.stdout', new=StringIO()):
                cli.run()
                items = cli.shopping_list.get_items()
                assert len(items) == 0

    def test_should_view_items_via_menu(self, cli):
        cli.shopping_list.add_item("apple", 1.50)
        cli.shopping_list.add_item("banana", 0.50)
        with patch('builtins.input', side_effect=['3', '5']):
            with patch('sys.stdout', new=StringIO()) as output:
                cli.run()
                output_str = output.getvalue()
                assert "apple" in output_str.lower()
                assert "banana" in output_str.lower()

    def test_should_view_total_cost_via_menu(self, cli):
        cli.shopping_list.add_item("apple", 1.50)
        cli.shopping_list.add_item("banana", 0.50)
        with patch('builtins.input', side_effect=['4', '5']):
            with patch('sys.stdout', new=StringIO()) as output:
                cli.run()
                output_str = output.getvalue()
                assert "$2.00" in output_str or "Total: $2.0" in output_str or "2.00" in output_str or "2.0" in output_str

    def test_should_exit_on_option_5(self, cli):
        with patch('builtins.input', side_effect=['5']):
            with patch('sys.stdout', new=StringIO()):
                # Should not raise any exception
                cli.run()

    def test_should_show_error_on_invalid_menu_selection(self, cli):
        with patch('builtins.input', side_effect=['99', '5']):
            with patch('sys.stderr', new=StringIO()) as error_output:
                cli.run()
                error_str = error_output.getvalue()
                assert "Error" in error_str

    def test_should_show_error_on_invalid_price(self, cli):
        with patch('builtins.input', side_effect=['1', 'apple', 'invalid', '5']):
            with patch('sys.stderr', new=StringIO()) as error_output:
                cli.run()
                error_str = error_output.getvalue()
                assert "Error" in error_str

    def test_should_show_error_on_empty_item_name(self, cli):
        with patch('builtins.input', side_effect=['1', '', '1.50', '5']):
            with patch('sys.stderr', new=StringIO()) as error_output:
                cli.run()
                error_str = error_output.getvalue()
                assert "Error" in error_str

    def test_should_show_error_when_removing_non_existent_item(self, cli):
        with patch('builtins.input', side_effect=['2', 'nonexistent', '5']):
            with patch('sys.stderr', new=StringIO()) as error_output:
                cli.run()
                error_str = error_output.getvalue()
                assert "Error" in error_str

    def test_should_loop_after_error(self, cli):
        # Provide invalid input first, then a valid command
        with patch('builtins.input', side_effect=['99', '5']):
            with patch('sys.stdout', new=StringIO()):
                cli.run()
                # Should have called input twice (menu shown twice)
                # First call returns '99' (invalid), loop continues
                # Second call returns '5' (exit)

    def test_should_accept_negative_price_input_and_retry(self, cli):
        with patch('builtins.input', side_effect=['1', 'apple', '-5', '5']):
            with patch('sys.stderr', new=StringIO()) as error_output:
                cli.run()
                error_str = error_output.getvalue()
                assert "Error" in error_str

    def test_should_update_item_when_adding_duplicate_via_menu(self, cli):
        with patch('builtins.input', side_effect=['1', 'apple', '1.50', '1', 'apple', '2.50', '5']):
            with patch('sys.stdout', new=StringIO()):
                cli.run()
                items = cli.shopping_list.get_items()
                assert len(items) == 1
                apple = [i for i in items if i.name == "apple"][0]
                assert apple.price == 2.50
