import sys
from shopping_list import (
    ShoppingList,
    InvalidPriceError,
    InvalidItemNameError,
    ItemNotFoundError,
)


class CLI:
    def __init__(self) -> None:
        self.shopping_list = ShoppingList()

    def run(self) -> None:
        while True:
            self._display_menu()
            choice = input("Select an option: ").strip()

            if choice == "1":
                self._add_item()
            elif choice == "2":
                self._remove_item()
            elif choice == "3":
                self._view_items()
            elif choice == "4":
                self._view_total()
            elif choice == "5":
                break
            else:
                sys.stderr.write("Error: Invalid menu selection\n")

    def _display_menu(self) -> None:
        print("\n=== Shopping List Manager ===")
        print("1. Add item")
        print("2. Remove item")
        print("3. View list")
        print("4. View total cost")
        print("5. Exit")

    def _add_item(self) -> None:
        name = input("Item name: ").strip()
        price_input = input("Price: ").strip()

        try:
            price = float(price_input)
        except ValueError:
            sys.stderr.write("Error: Price must be a valid number\n")
            return

        try:
            self.shopping_list.add_item(name, price)
            print(f"Added {name} at ${price:.2f}")
        except InvalidItemNameError as e:
            sys.stderr.write(f"Error: {e}\n")
        except InvalidPriceError as e:
            sys.stderr.write(f"Error: {e}\n")

    def _remove_item(self) -> None:
        name = input("Item name to remove: ").strip()
        try:
            self.shopping_list.remove_item(name)
            print(f"Removed {name}")
        except ItemNotFoundError as e:
            sys.stderr.write(f"Error: {e}\n")

    def _view_items(self) -> None:
        items = self.shopping_list.get_items()
        if not items:
            print("Shopping list is empty")
        else:
            print("\n=== Shopping List ===")
            for item in items:
                print(f"  {item.name}: ${item.price:.2f}")

    def _view_total(self) -> None:
        total = self.shopping_list.get_total_cost()
        print(f"Total: ${total:.2f}")
