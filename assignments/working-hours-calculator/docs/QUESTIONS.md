# Questions: Working Hours Calculator

## Complexity & Scale

**Q1: What is the expected input volume / scale?**
Will this function be called once per shift calculation, or millions of times in batch processing?

**Answer:** millions of times in batch processing

---

**Q2: Are there memory constraints?**
Can we pre-compute/cache anything, or must it be stateless and efficient on every call?

**Answer:** must be stateless and efficient on every call

---

**Q3: Performance requirements?**
Should this prioritize correctness, speed, or readability? Are there latency targets?

**Answer:** latency no more than 200ms to return an answer

---

## Correctness & Edge Cases

**Q4: What should happen when start_time == end_time?**
Does this represent 0 hours (no work) or 24 hours (full day shift)?

**Answer:** 24 hours

---

**Q5: Can we assume valid 24-hour format inputs (e.g., both strings are exactly HH:MM)?**
Or must we handle gracefully: extra whitespace, lowercase/uppercase, other delimiters?

**Answer:** lowercase/uppercase not relevant as we;re talking about numbers. validation must happen to validate valid 24-hour format inputs. as written in requirements, ValueError shuold be raised if invalid input provided.

---

**Q6: For midnight crossing detection, is the rule deterministic?**
If end_time < start_time, always assume next day (not ambiguous interpretation)?

**Answer:** yes

---

**Q7: Should the function handle seconds (HH:MM:SS)?**
Or only hours and minutes as specified?

**Answer:** only hours and minutes

---

## Output Precision

**Q8: Rounding behavior for edge cases?**
If a shift is 1 hour 1 second, should it round, truncate, or use exact decimal?

**Answer:** seconds are not part of calculations. rounding to 2 decimal places

---

## Error Handling

**Q9: Should invalid input raise ValueError, or return a sentinel value (e.g., -1.0)?**
The requirement says "raise ValueError", but confirming scope.

**Answer:** raise ValueError

---

**Q10: What constitutes "invalid format"?**
Only format violations (wrong HH:MM structure), or also semantic violations (e.g., hour > 23)?

**Answer:** format and semantic violations

---
