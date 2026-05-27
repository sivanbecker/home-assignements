# Home Assignments

A workspace for solving and evaluating Python home assignments using a TDD workflow and Claude Code skills.

## Skills

Three Claude Code skills are available. Invoke any of them from the Claude Code CLI by typing the `/skill-name` command.

### `/new-py-assignment` — Start a new assignment

Scaffolds the folder structure and guides you through the full lifecycle:
**Intake → Standards → Design → TDD implementation → Debrief**

```
/new-py-assignment
```

Use this at the beginning of every new assignment. It creates the `docs/` structure, asks clarifying questions, proposes a design for approval, and then drives TDD with explicit stop points before proceeding.

---

### `/python-interviewer-review` — Code quality review

Performs a production-grade code review across 8 dimensions, producing scored output and a final senior-level verdict.

```
/python-interviewer-review
use @assignments/<folder-name>/src to review the code
```

**Dimensions scored (0–10):**
1. Clean Code (DRY, KISS, YAGNI)
2. Architecture & Design Patterns
3. Pythonic Idioms & Modern Practices
4. Bugs, Edge Cases & Robustness
5. Security & Vulnerability Assessment
6. Performance & Resource Efficiency
7. Code Style, Linting & Readability
8. Testability & Maintainability

---

### `/python-tests-scanner` — Test suite evaluation

Evaluates the test suite quality across 4 dimensions and produces a signal-to-noise ratio verdict.

```
/python-tests-scanner
use @assignments/<folder-name>/src/tests to scan the tests
```

**Dimensions covered:**
1. Low-value & unnecessary tests
2. Missing tests for critical functionality
3. Consolidation & redundancy opportunities
4. Mocking hygiene & best practices

---

## Folder Structure

```
assignments/
  <assignment-name>/
    assignment.md         # Original brief
    pyproject.toml
    src/
      *.py                # Implementation
      tests/
        test_*.py
    docs/
      INTAKE.md
      DESIGN.md
      DECISIONS.md
      DEBRIEF.md
```

See `CLAUDE.md` for TDD discipline rules and `STANDARDS.md` for technical decision options.
