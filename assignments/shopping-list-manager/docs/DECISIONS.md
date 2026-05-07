# Shopping List Manager - Design Decisions

## Input Validation
**Choice:** Manual `isinstance` guards  
**Rationale:** Item names and prices are single values with straightforward type and range checks. Zero dependencies, lightweight, immediately obvious. Sufficient for a CLI app.

## Error Handling
**Choice:** Custom exception classes  
**Rationale:** Domain-specific exceptions (`InvalidPriceError`, `ItemNotFoundError`, `InvalidInputError`) provide clear, expressive error messages that map to the requirement of outputting `Error: <message>` to stderr. Signals intentional design.

## Data Modeling
**Choice:** `dataclass` for Item  
**Rationale:** Clean, lightweight, stdlib-only. Represents an Item with `name` and `price` clearly. No validation overhead since validation happens at the CLI boundary on user input.

## CLI Interface
**Choice:** Manual REPL loop with `input()`  
**Rationale:** Simple menu-driven loop with manual parsing. Full control, no external dependencies, clear for this scope. Parse menu selection and arguments manually in the main loop.

## Testing Approach
**Choice:** Plain `pytest` functions with parametrization where appropriate  
**Rationale:** TDD workflow. Parametrize for testing the same logic across multiple input/output pairs (e.g., adding items with different prices, removing items). Use fixtures for shared setup (pre-populated shopping list).

## Data Structure for Inventory
**Choice:** `dict` with case-insensitive lookup (normalize to lowercase)  
**Rationale:** O(1) lookup and update for add/remove/total operations. Case-insensitive per requirements. Dictionary values are floats (prices). Supports up to 100k items within latency requirements.
