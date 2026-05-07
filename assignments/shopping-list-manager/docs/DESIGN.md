# Shopping List Manager - Design

## Domain Concepts

### Item
A single entry in the shopping list.
- **name**: `str` — non-empty, case-insensitive for lookups
- **price**: `float` — non-negative

### ShoppingList
The core domain object managing the inventory.
- **items**: `dict[str, float]` — keys are lowercase item names, values are prices
- Supports: add (or update), remove, view, total cost

### CLI Application
REPL loop that reads user commands and delegates to ShoppingList.

---

## Data Flow

1. **User Input** → validate type and range → **CLI**
2. **CLI** → parse menu selection → **ShoppingList method call**
3. **ShoppingList** → update internal state (dict) → return result or raise exception
4. **Exception** → caught by CLI → output to stderr as `Error: <message>`
5. **Success** → CLI outputs result (items, total, or confirmation)

---

## Module Breakdown

### `src/shopping_list.py`
**Responsibility:** Core domain logic

**Classes:**
- `ShoppingList`: manages inventory (`items` dict), supports:
  - `add_item(name: str, price: float)` → adds or updates
  - `remove_item(name: str)` → removes or raises `ItemNotFoundError`
  - `get_items() -> list[Item]` → returns all items (for display)
  - `get_total_cost() -> float` → sum of all prices
  - `clear()` → empty the list

**Helpers:**
- `_normalize_name(name: str) -> str` — converts to lowercase, strips whitespace
- Item dataclass (or use module-level type hints)

### `src/cli.py`
**Responsibility:** User interaction and I/O

**Classes/Functions:**
- `main()` → REPL loop
  - Loop displays menu
  - Read user input (menu selection + arguments)
  - Dispatch to ShoppingList methods
  - Catch exceptions and print to stderr
  - Display results to stdout

**Menu:**
1. Add item
2. Remove item
3. View list
4. View total cost
5. Exit

---

## Error Handling

**Custom Exceptions** (in `src/shopping_list.py`):
- `InvalidPriceError(message)` — negative, non-numeric, or non-float price
- `InvalidItemNameError(message)` — empty string
- `ItemNotFoundError(message)` — remove non-existent item
- `InvalidInputError(message)` — invalid menu selection

**CLI Behavior:**
- Catch exceptions from ShoppingList
- Print to stderr: `Error: {exception.message}`
- Keep looping (don't exit)

---

## Performance Considerations

- **Inventory size:** up to 100k items
- **Latency target:** 100–200ms per operation
- **Data structure:** `dict` for O(1) add/remove/lookup
- **Decimal precision:** prices stored as `float` (Python floats are IEEE 754 doubles, sufficient for typical currency)

**Analysis:**
- Add/remove/lookup: O(1) dict operations — well under latency target
- Total cost: O(n) sum over all items — 100k items with float addition is negligible (microseconds)

---

## Design Patterns

### **Domain-Driven Design (DDD)**
ShoppingList is the aggregate root, encapsulating inventory rules (case-insensitive names, no negative prices, no empty names).

### **Separation of Concerns**
- `shopping_list.py`: pure domain logic, no I/O
- `cli.py`: I/O and user interaction only

### **Custom Exceptions as Domain Language**
Each exception clearly signals what went wrong in the domain (invalid price, missing item) rather than generic `ValueError`.

### **Immutable Item Representation**
Use `@dataclass` for Item to make the data structure clear and leverage `__repr__`, `__eq__`, etc.

---

## What We're Not Doing

- Persistence (no file/database — state is in-memory)
- Async/concurrent operations (single-threaded REPL)
- Rich TUI (simple text menu)
- Undo/history
- Quantity tracking (only price per item)
