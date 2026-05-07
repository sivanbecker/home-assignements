from dataclasses import dataclass


class InvalidPriceError(Exception):
    pass


class InvalidItemNameError(Exception):
    pass


class ItemNotFoundError(Exception):
    pass


class InvalidInputError(Exception):
    pass


@dataclass
class Item:
    name: str
    price: float


class ShoppingList:
    def __init__(self) -> None:
        self.items: dict[str, float] = {}

    def add_item(self, name: str, price: float) -> None:
        normalized_name = self._normalize_name(name)

        if not normalized_name:
            raise InvalidItemNameError("Item name cannot be empty")

        if not isinstance(price, (int, float)) or isinstance(price, bool):
            raise InvalidPriceError("Price must be a number")

        if price < 0:
            raise InvalidPriceError("Price cannot be negative")

        self.items[normalized_name] = float(price)

    def remove_item(self, name: str) -> None:
        normalized_name = self._normalize_name(name)
        if normalized_name not in self.items:
            raise ItemNotFoundError(f"Item '{name}' not found in shopping list")
        del self.items[normalized_name]

    def get_items(self) -> list[Item]:
        return [Item(name=name, price=price) for name, price in self.items.items()]

    def get_total_cost(self) -> float:
        return sum(self.items.values())

    def clear(self) -> None:
        self.items.clear()

    @staticmethod
    def _normalize_name(name: str) -> str:
        return name.strip().lower()
