# Python Home Assignment Instructions (TDD)

## Project Structure
- Source code: `src/`
- Tests: `src/tests/`
- Documentation: `docs/` (all .md files except this one)

## Technical Environment
- Python 3.12+, `uv` for dependencies (`uv add`, `uv run`)
- Testing: `pytest` | Linting: `ruff`

## Core Principles
- TDD: Red → Green → Refactor. No implementation without a failing test first.
- DRY, orthogonal modules, ETC (easy to change).
- Type hints on all function signatures.
- Commit after every Green or Refactor step.
- Test names describe behavior: `test_should_return_error_when_input_is_negative`

## Workflow (follow in order)

### 1. Intake
Parse the assignment and produce `docs/INTAKE.md`:
- Requirements, constraints, inputs/outputs, edge cases, out of scope.

Produce `docs/QUESTIONS.md` with clarifying questions grouped by: requirements, constraints, edge cases.
Every question in `docs/QUESTIONS.md` must be followed by a blank `**Answer:**` line for the user to fill in.
`docs/QUESTIONS.md` must always include a **Complexity & Scale** section with:
- Expected input size / volume (affects time complexity target)
- Memory constraints (affects space complexity approach)
- Performance requirements (latency, throughput)
- Should the solution be optimized for time, space, or readability?

Also read the **Universal Questions Checklist** in `STANDARDS.md` and include
any applicable questions in `docs/QUESTIONS.md`.


**Stop here. Wait for the user to answer questions in `docs/QUESTIONS.md` before continuing.**

### 2. Standards Review
Read `STANDARDS.md`. For each relevant category (validation, error handling, data modeling):
- Present options with recommendation and reasoning for this assignment.
- Wait for user confirmation before proceeding.
- Log confirmed choices in `docs/DECISIONS.md`.

### 3. Design
Produce `docs/DESIGN.md`:
- Domain concepts, module breakdown, data flow, chosen design patterns with rationale.

**Stop here. Wait for user approval of `docs/DESIGN.md` before writing any tests.**

### 4. TDD Execution
- Write tests in `src/tests/`, implementation in `src/`.
- Update `docs/DECISIONS.md` whenever a significant choice is made.

### 5. Debrief
Produce `docs/DEBRIEF.md`:
- Per-module explanation, patterns used, tradeoffs, what you'd change with more time.