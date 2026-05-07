# Shekel Converter - Clarifying Questions

## Requirements
1. Should the function return the converted value or only print it?
** answer ** yes, function should return a value.

2. Does the function need to convert to both USD and EUR, or does the `rate` parameter determine which currency?
** answer ** rate determine which currency

3. What should happen when input is invalid (non-numeric)?
   - Raise an exception?
   - Return None or a default value?
   - Return an error message?
** answer ** should raise an exception

4. Should the function validate that `amount` is non-negative (reject negative amounts)?
** answer ** reject negative amounts as invalid value

## Constraints
1. What should happen when `amount` or `rate` is not a number? Should it:
   - Raise an exception (ValueError)?
   - Return a default value?
   - Print an error message?
   - Return None?
   ** answer ** should raise an exception


2. Should the function accept strings that represent numbers (e.g., "123.45"), or only numeric types?
** answer ** only numeric types

## Edge Cases
1. What's the expected behavior for:
   - Zero amount?
   - Very large numbers (precision concerns)?
   - Negative rates?
** answer **
   - zero amount is invalid input
   - very large nums that may trigger precision concerns are invalid input
   - negative rates and megative amounts are invalid inputs 
   
2. Should there be input validation to ensure `rate` is positive (makes sense for exchange rates)?
** answer ** yes, validate input
