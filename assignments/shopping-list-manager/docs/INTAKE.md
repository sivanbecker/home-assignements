# Shopping List Manager - Intake

## Requirements
- CLI-based inventory system for a small grocery store ("makolet")
- Use dictionary to store items (keys) and their prices (values)
- Implement interactive loop with three operations:
  1. Add an item (with price)
  2. Remove an item
  3. View total cost of all items

## Constraints
- Dictionary as primary data structure
- Interactive CLI loop (user-driven menu)
- Must support add/remove/view operations

## Inputs/Outputs
- **Input:** User menu selections and item names/prices via CLI
- **Output:** Menu prompts, confirmation messages, total cost calculation

## Edge Cases
- Adding duplicate item (update price or reject?)
- Removing non-existent item
- Viewing total when inventory is empty
- Invalid menu selections
- Invalid price input (negative, non-numeric)
- Empty item names

## Out of Scope
- Data persistence (saving to file)
- Multiple user accounts
- Quantity tracking (just item → price mapping)
- Search/filter by price range
