# Palindrome Detector - Design

## Domain Concepts
- **Palindrome:** A string that reads the same forwards and backwards (ignoring spaces, capitalization, punctuation)
- **Normalization:** Transform input by removing non-alphanumeric characters and converting to lowercase
- **Comparison:** Check if normalized string equals its reverse
- **Validation:** Reject non-string input, non-ASCII characters, and strings with only spaces/punctuation

## Module Breakdown

### `palindrome.py`

#### `is_palindrome(text: str) -> bool`
- **Purpose:** Check if a string is a palindrome (ignoring spaces, case, punctuation)
- **Input Validation:**
  - Check `text` is `str` → raise `TypeError` if not
  - Check for non-ASCII characters → raise `ValueError` if found
  - Check if string has at least one alphanumeric character → raise `ValueError` if only spaces/punctuation
- **Logic:**
  1. Normalize: remove non-alphanumeric chars, convert to lowercase
  2. Compare: check if normalized == normalized[::-1]
- **Output:** Boolean (True if palindrome, False otherwise)
- **Time Complexity:** O(n) where n = string length (single pass for validation + single pass for comparison)
- **Space Complexity:** O(n) for normalized string storage (within 4MB constraint)

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
Normalize: remove non-alphanumeric, lowercase
  ↓
Compare: normalized == normalized[::-1]
  ↓
Return: True or False
```

## Design Patterns & Rationale
- **Fail-Fast Validation:** All validation before processing
- **Single Responsibility:** One function doing one thing (validate + check palindrome)
- **Type Hints:** Full annotations for clarity
- **O(n) Complexity:** Linear time, meets requirement
- **4MB Memory Constraint:** Normalized string is at most same size as input; input up to 1M chars (1MB) fits easily

## Edge Cases Handled
- Non-string input → `TypeError`
- Non-ASCII characters → `ValueError`
- Only spaces/punctuation → `ValueError`
- Empty string → `True` (per requirements)
- Single character → `True` (per requirements)
- Mixed case and punctuation → normalized and checked correctly
