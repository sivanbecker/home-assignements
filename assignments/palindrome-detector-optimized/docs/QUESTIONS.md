# Palindrome Detector (Optimized) - Clarifying Questions

## Requirements
1. What should the function return? A boolean, or should it print a message?
**Answer:** boolean

2. Should numeric characters be treated as characters to check (e.g., "12321" → True)?
**Answer:** yes

3. What about non-ASCII characters (accents, non-Latin scripts)?
**Answer:** these are invalid. should raise an exception

## Constraints
1. Should empty string be considered a palindrome (True or False)?
**Answer:** yes

2. Should a string with only spaces/punctuation be considered a palindrome?
**Answer:** no

3. How should the function handle None or non-string input?
**Answer:** invalid input. raise exception

## Edge Cases
1. Single character string — should it be a palindrome?
**Answer:** yes

2. Very long strings — are there performance constraints?
**Answer:** code should support O(n) time complexity

3. Unicode characters with diacritics (e.g., "café") — normalize them or treat as-is?
**Answer:** as is

## Complexity & Scale
1. What is the expected input size / volume?
**Answer:** up to ~1 million chars

2. Are there memory constraints?
**Answer:** ≤ 500KB (strict constraint)

3. Are there latency or throughput requirements?
**Answer:** no but note time complexity and memory limit mentioned.

4. Should the solution optimize for time, space, or readability — or balance all three?
**Answer:** optimize for space (given 500KB constraint); time should still be O(n)

## Correctness & Output
1. Is there an exact output format required?
**Answer:** no just boolean or exception

2. Should errors be surfaced to the caller or logged silently?
**Answer:** surfaced
