# Palindrome Detector - Clarifying Questions

## Requirements
1. What should the function return? A boolean, or should it print a message?
** answer ** boolean
2. Should numeric characters be treated as characters to check (e.g., "12321" → True)?
** answer ** yes
3. What about non-ASCII characters (accents, non-Latin scripts)?
** answer ** these are invalid. should raise an exception 

## Constraints
1. Should empty string be considered a palindrome (True or False)?
** answer ** yes
2. Should a string with only spaces/punctuation be considered a palindrome?
** answer ** no
3. How should the function handle None or non-string input?
** answer ** invalid input. raise exception

## Edge Cases
1. Single character string — should it be a palindrome?
** answer ** yes
2. Very long strings — are there performance constraints?
** answer ** code should support O(n) time constraint 
3. Unicode characters with diacritics (e.g., "café") — normalize them or treat as-is?
** answer ** as is
