# Palindrome Detector (Optimized) - Decisions Log

## Standards Review Confirmations

### Input Validation
**Choice:** Manual `isinstance` guards  
**Rationale:** Single string input with straightforward checks. Memory constraint doesn't affect validation approach.

### Error Handling
**Choice:** Built-in exceptions (`ValueError`, `TypeError`)  
**Rationale:** Simple, idiomatic Python. All invalid inputs raise exceptions; caller only needs True/False or exception.

### Data Modeling
**Choice:** Not needed  
**Rationale:** Single boolean return value; no complex data structure.

### Testing Patterns
**Choice:** `@pytest.mark.parametrize` with memory tracking  
**Rationale:** Many test cases across different concerns. Use `tracemalloc` to verify peak memory stays within 500KB.

---

## Implementation Decisions
(To be updated as choices emerge during TDD execution)

### Key Constraint: 500KB Memory Limit
- Cannot allocate normalized string (would be ~1MB for 1M char input)
- Must use two-pointer approach: start from both ends, skip non-alphanumeric on-the-fly
- Trade validation simplicity for memory efficiency
