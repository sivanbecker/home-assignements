# Shekel Converter - Intake

## Requirements
- Create a function `convert_currency(amount, rate)` that converts Israeli New Shekels (ILS) to USD and EUR
- Handle cases where input might not be a number
- Print the result formatted to two decimal places

## Constraints
- Function signature: `convert_currency(amount, rate)`
- Output must be formatted to exactly 2 decimal places

## Inputs/Outputs
- **Input**: 
  - `amount`: value to convert (should be a number)
  - `rate`: conversion rate (should be a number)
- **Output**: Printed formatted string with result to 2 decimal places

## Edge Cases
- Non-numeric `amount` input (string, None, etc.)
- Non-numeric `rate` input (string, None, etc.)
- Negative amounts
- Zero amount
- Very large numbers
- Float precision edge cases

## Out of Scope
- Storing exchange rates externally
- Multiple currency conversions in one call
- Currency validation (assuming ILS → USD/EUR are the only targets)
- Persistent conversion history
