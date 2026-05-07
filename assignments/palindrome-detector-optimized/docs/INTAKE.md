# Palindrome Detector (Optimized) - Intake

## Requirements
- Create a function/script that checks if a string or phrase is a palindrome
- Ignore spaces when checking
- Ignore capitalization (case-insensitive)
- Ignore punctuation
- **Memory constraint: ≤ 500KB** (vs 4MB in original)
- String length: up to ~1,000,000 characters

## Constraints
- Must handle multi-word phrases
- Example must work: "A man, a plan, a canal: Panama" → True
- Strict memory limit: cannot allocate normalized string (1MB+ for 1M char input)

## Inputs/Outputs
- **Input**: A string (phrase or word)
- **Output**: Boolean (True if palindrome, False otherwise)

## Edge Cases
- Empty string
- Single character
- String with only spaces/punctuation
- Mixed case and punctuation
- Numeric characters in the string
- Very long strings (up to 1M chars)

## Out of Scope
- Non-ASCII characters (unless clarified)
- Multiple language support
