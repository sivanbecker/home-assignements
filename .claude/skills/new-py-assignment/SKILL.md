---
name: new-py-assignment
description: "Create and scaffold a new Python home assignment with TDD workflow. Use when: starting a new assignment, setting up project structure, guiding through intake → design → implementation → debrief"
type: workflow
---

# New Python Assignment Workflow

This skill automates the setup and guides you through the complete TDD-driven Python assignment process.

## What This Skill Does

1. **Scaffolds folder structure** under `assignments/`
2. **Guides through Intake phase** — parse requirements, document questions
3. **Standards Review** — confirm technical decisions (validation, error handling, data modeling)
4. **Design phase** — architecture and data flow documentation
5. **TDD Execution** — write tests, implement, refactor with commit checkpoints
6. **Debrief** — document patterns, tradeoffs, and learnings

## Workflow

### Phase 1: Setup & Intake

**Input:** assignment name and description

**Output:** 
- Folder structure: `assignments/<assignment-name>/`
- Stub files: `assignment.md`, `src/`, `src/tests/`, `docs/`
- Initial documentation: `docs/INTAKE.md`, `docs/QUESTIONS.md`

**Stop point:** Wait for user to answer questions in `docs/QUESTIONS.md`

### Phase 2: Standards Review

Read `STANDARDS.md` and present decision options for:
- Input validation (pydantic vs dataclass vs manual)
- Error handling (custom exceptions vs built-in vs Result type)
- Data modeling (pydantic vs dataclass vs dict)
- CLI interface (argparse vs typer vs click) — if applicable
- Async vs Sync
- Testing patterns (pytest functions, parametrize, fixtures, mocks)

**Output:** `docs/DECISIONS.md` with confirmed choices and rationale

**Stop point:** Wait for user confirmation on all decision points

### Phase 3: Design

Produce `docs/DESIGN.md`:
- Domain concepts and language
- Module breakdown
- Data flow diagrams (as text descriptions)
- Chosen design patterns with rationale
- Storage/persistence model

**Stop point:** Wait for user approval before writing tests

### Phase 4: TDD Execution

1. Write failing test in `src/tests/test_*.py`
2. Implement minimum code in `src/` to pass test (Green)
3. Refactor if needed, keeping tests passing
4. Commit after each Green or Refactor step
5. Repeat until all requirements are met

**Update:** Record any significant decisions in `docs/DECISIONS.md` as you go

### Phase 5: Debrief

Produce `docs/DEBRIEF.md`:
- Per-module explanation of what was built and why
- Patterns used (factory, builder, composition, etc.)
- Tradeoffs made (readability vs performance, extensibility vs simplicity)
- What you'd change with more time
- Lessons learned

**Final output:** Ready for PR review

## Quick Start

```
/new-py-assignment
```

Then follow the prompts. The skill will:
- Create the folder structure
- Ask for assignment name and description
- Initialize stub files
- Guide you through each phase with explicit stop points

## Key Files Referenced

- **CLAUDE.md** — Full TDD workflow and principles
- **STANDARDS.md** — Technical decision options with tradeoffs
- Per-assignment docs:
  - `docs/INTAKE.md` — Requirements and constraints
  - `docs/QUESTIONS.md` — Clarifying questions for user input
  - `docs/DECISIONS.md` — Confirmed technical choices
  - `docs/DESIGN.md` — Architecture and design
  - `docs/DEBRIEF.md` — Retrospective and learnings

## Important Notes

- **Follow the stop points** — don't skip ahead. Each phase builds on the previous one.
- **One failing test per commit** in the TDD phase. Write test → make it fail → implement → make it pass → commit.
- **Type hints on all function signatures** — non-negotiable.
- **Test names describe behavior** — use `test_should_return_error_when_...` pattern.
- **Commit after every Green or Refactor step** — not just at the end.

## Directory Structure After Setup

```
assignments/
└── <assignment-name>/
    ├── assignment.md           # Original assignment prompt
    ├── docs/
    │   ├── INTAKE.md           # Requirements, constraints, edge cases
    │   ├── QUESTIONS.md        # Clarifying questions (user fills in answers)
    │   ├── DECISIONS.md        # Confirmed technical decisions
    │   ├── DESIGN.md           # Architecture and design
    │   └── DEBRIEF.md          # Retrospective (end of project)
    └── src/
        ├── __init__.py
        ├── main.py             # Entry point
        ├── *.py                # Domain logic modules
        └── tests/
            ├── __init__.py
            └── test_*.py       # Test modules (one per domain module)
```

## Environment

- **Python:** 3.12+
- **Package manager:** `uv` (`uv add`, `uv run`)
- **Testing:** `pytest` (`uv run pytest`)
- **Linting:** `ruff` (`uv run ruff check`)

Run tests early and often. Linting should pass before committing.
