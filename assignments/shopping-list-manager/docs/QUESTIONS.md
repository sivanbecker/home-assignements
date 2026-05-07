# Shopping List Manager - Clarifying Questions

## Requirements
1. Should adding a duplicate item update the price, or reject the operation?
**Answer:** update

2. Should the price be stored as float or int (e.g., 10.50 or 1050 cents)?
**Answer:** float

3. Should the CLI be a REPL loop or process commands once and exit?
**Answer:** loop

## Constraints
1. How should the app handle removing a non-existent item?
**Answer:**  issue a warning

2. Should item names be case-sensitive?
**Answer:** no

3. How should the app handle invalid menu selections?
**Answer:** issue a warning 

## Edge Cases
1. What happens if the user tries to add an item with invalid price (negative, non-numeric)?
**Answer:** prevent with a warning and wait for a valid price

2. Can item names be empty strings?
**Answer:** no

3. Should prices have decimal places (e.g., 5.99)?
**Answer:** not a must but all proces are floats so 6 will be 6.0

## Complexity & Scale
1. What is the expected number of items in the inventory?
**Answer:** could be upto 100k items

2. Are there performance requirements (e.g., add/remove/total should be fast)?
**Answer:** yes, 100-200ms latency

3. Should the solution optimize for speed, clarity, or maintainability?
**Answer:** maintainability as long as performance is ok

## Correctness & Output
1. What is the exact output format for viewing total cost (e.g., "Total: $X.XX")?
**Answer:** Total: $X.XX

2. Should errors be printed to stdout or stderr, and in what format?
**Answer:** stderr. format Error: err string 

3. Should the app exit gracefully on invalid input, or keep retrying?
**Answer:** keep retrying
