# Palindrome Detector (Optimized) - Design

## Domain Concepts
- **Palindrome:** A string that reads the same forwards and backwards (ignoring spaces, capitalization, punctuation)
- **Two-Pointer Approach:** Compare characters from both ends moving inward, skipping non-alphanumeric chars on-the-fly
- **Memory-Efficient:** No allocation of normalized string; O(1) space (only pointers + a few variables)
- **Validation:** Reject non-string input, non-ASCII characters, and strings with only spaces/punctuation

## Module Breakdown

### `palindrome.py`

#### `is_palindrome(text: str) -> bool`
- **Purpose:** Check if a string is a palindrome (ignoring spaces, case, punctuation) with strict 500KB memory limit
- **Input Validation:**
  - Check `text` is `str` → raise `TypeError` if not
  - Check for non-ASCII characters → raise `ValueError` if found
  - Quick scan: ensure string has at least one alphanumeric character (or is empty) → raise `ValueError` if only spaces/punctuation
- **Logic:**
  1. Validate input (one pass through string)
  2. Two-pointer approach:
     - Left pointer starts at beginning
     - Right pointer starts at end
     - Skip non-alphanumeric characters from both ends
     - Compare characters (case-insensitive)
     - Move pointers inward
     - Return False if mismatch found
     - Return True if pointers meet
- **Output:** Boolean (True if palindrome, False otherwise)
- **Time Complexity:** O(n) where n = string length (two passes: validation + comparison)
- **Space Complexity:** O(1) constant space (only pointers and a few variables)

## Data Flow

```
Input: text (string)
  ↓
Validate: is string?
  ↓ (fail → TypeError)
Validate: only ASCII characters?
  ↓ (fail → ValueError)
Validate: at least one alphanumeric char?
  ↓ (fail → ValueError)
Two-pointer comparison:
  left = 0, right = len(text) - 1
  while left < right:
    skip non-alphanumeric from left
    skip non-alphanumeric from right
    compare text[left].lower() == text[right].lower()
    if not equal: return False
    move left++, right--
  ↓
Return: True (all chars matched)
```

## Design Patterns & Rationale
- **Fail-Fast Validation:** All validation before processing
- **Two-Pointer Technique:** Memory-efficient palindrome check without creating normalized string
- **On-the-Fly Filtering:** Skip non-alphanumeric characters without storing them
- **Type Hints:** Full annotations for clarity
- **O(n) Time, O(1) Space:** Meets both time complexity and memory constraints

## Memory Analysis
- Input string: up to 1MB (1M chars × 1 byte ASCII)
- Algorithm storage: pointers (2 × 8 bytes), temp variables (~100 bytes)
- **Peak memory:** ~100 bytes (well within 500KB constraint)
- **Validation pass:** temporary char iteration (O(1) extra space)

## Edge Cases Handled
- Non-string input → `TypeError`
- Non-ASCII characters → `ValueError`
- Only spaces/punctuation → `ValueError`
- Empty string → `True` (per requirements)
- Single character → `True` (per requirements)
- Mixed case and punctuation → handled by two-pointer with case-insensitive compare
- Very long strings (1M chars) → O(n) time, O(1) space
