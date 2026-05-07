# Shekel Converter - Decisions Log

## Standards Review Confirmations

### Input Validation
**Choice:** Manual `isinstance` guards  
**Rationale:** Single-value validation scenario with straightforward logic. No external dependencies needed; pydantic/dataclass overhead is unnecessary.

### Error Handling
**Choice:** Built-in exceptions (`ValueError`, `TypeError`)  
**Rationale:** Algorithm-focused assignment where error distinction doesn't matter. Idiomatic Python and keeps solution simple.

### Data Modeling
**Choice:** Not needed  
**Rationale:** Function returns a single float value; no complex data structure required.

---

## Implementation Decisions
(To be updated as choices emerge during TDD execution)
