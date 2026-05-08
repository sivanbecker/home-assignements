# Home Assignment Instructions (TDD)

## Core Principles

### TDD Discipline
- **Red → Green → Refactor.** No implementation without a failing test first.
- Write tests that describe behavior, not implementation.
- Test names: `test_should_return_error_when_input_is_negative`
- Commit after every Green or Refactor step—not at the end.

### Code Quality
- **Type hints** on all function signatures. Non-negotiable.
- **DRY**: Don't repeat yourself. Orthogonal modules with clear boundaries.
- **ETC**: Easy to change. Optimize for maintainability over micro-optimizations.
- Three similar lines is better than a premature abstraction.

### Documentation
- Document the **why**, not the what. Code names should be self-evident.
- Comments only when the invariant is non-obvious or there's a workaround for a specific bug.
- No half-finished implementations or feature flags.

### Workflow
For the step-by-step assignment workflow (Intake → Standards → Design → TDD → Debrief), use the `/new-py-assignment` skill. It automates folder structure creation and guides you through each phase with explicit stop points for decisions and approvals.

**For complex assignments with large codebases:**
- Design phase produces a concise, actionable document listing all modules, classes, functions, and data flow
- Design includes an implementation checklist to track progress across all components
- TDD phase has frequent stopping points for review:
  - Stop after each test file is created (before tests are written) — preview what will be tested
  - Stop after each test class is fully written — show all test functions for that class
  - Stop after each module/class/function is implemented — 1-line summary + link to code
  - Always wait for explicit approval before proceeding

Reference `STANDARDS.md` for technical decision options (validation, error handling, data modeling, CLI, async, logging, testing patterns).