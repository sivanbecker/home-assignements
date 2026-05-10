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

### Phase 1: Setup & Intake (Fast Intake Mode — 10–15 minutes)

**Input:** assignment name and description

**Before starting:**
- Create a new git branch named `work/<assignment-name>`

**docs/INTAKE.md (compact, under 3 minutes to read):**
1. **Functional requirements** — bullet list of behaviors only (no implementation details)
2. **Constraints and edge cases** — bullet list of limits, input quirks, special cases

**docs/QUESTIONS.md (3–5 high-impact questions only):**
- Select only 3–5 questions with the biggest design impact, typically from:
  - Input size / performance  
  - Error handling strategy (exceptions vs skipping vs ignoring)  
  - Exact output format (ordering, rounding, encoding)  
  - Persistence (state across runs) if relevant  
  - Concurrency (single-threaded vs concurrent) if relevant  
- For each question, add an "assumption stub" line so you can document assumptions if you don't ask the interviewer
- Add a final section:
  - "Recommended questions to ask interviewer" (1–3 with biggest impact)  
  - "Questions to convert into explicit assumptions" (the rest)

**Output:** 
- Folder structure: `assignments/<assignment-name>/`
- Stub files: `assignment.md`, `src/`, `src/tests/`, `docs/`
- Initial documentation: `docs/INTAKE.md`, `docs/QUESTIONS.md`

**Stop point:** Wait for user to answer questions in `docs/QUESTIONS.md`

### Phase 2: Standards Review (5–10 minutes)

**Default Standards Profile (assume unless assignment clearly needs deviation):**
- **Input validation:** Manual checks or simple dataclasses (not pydantic unless complex structured data)
- **Error handling:** Built-in exceptions (ValueError, TypeError) with clear messages
- **Data modeling:** Plain dicts or small dataclasses where helpful
- **Async vs sync:** Synchronous only, unless explicitly required
- **Testing pattern:** Plain pytest functions with light parametrization only when it improves readability

**Review process:**
- Assume this default profile for the assignment
- Only propose deviations when the assignment text clearly justifies it
- Document the rationale briefly

**Output:** `docs/DECISIONS.md` — at most 8 short bullet points summarizing chosen options and rationale (readable in under 2 minutes)

**Stop point:** After writing `docs/DECISIONS.md`, stop and wait for user review before proceeding to Design phase

### Phase 3: Design (Tiny, Executable Design — under 3 minutes to read)

**Size constraints:**
- Maximum 3 modules
- Maximum 5 total functions/classes
- No long prose; keep everything tight and action-oriented

**Module structure (prefer simple patterns like):**
- An input/output or CLI layer
- A core logic layer
- Optionally a small models/types layer
- If the problem is small, merge modules to keep structure minimal

**Produce `docs/DESIGN.md` with these sections:**

1. **Module breakdown** — for each module:
   - Name and responsibility (one sentence)
   - What it exposes (function/class names only)

2. **Function/class signatures** — for each major component:
   - Name  
   - Parameters with type hints  
   - Return type  
   - One-sentence responsibility in plain language

3. **Data flow** — numbered list of 4–8 steps (no paragraphs), example:
   - 1: Read input from X  
   - 2: Validate/parse into Y  
   - 3: Transform Y into Z via core logic  
   - 4: Format Z into final output  

4. **Implementation checklist** — all modules, functions, classes to be built:
   - Mark each as "must-have" or "nice-to-have"
   - Use this to track progress during TDD and manage time

**Stop point:** Wait for user approval before writing tests

### Phase 4: TDD Execution — Pattern-Based Review at Every Stop

For each test file and corresponding implementation:

#### Step 1: Create Test File

**Stop: Test file creation** — Show test file path and scope (which module/classes being tested), wait for approval to proceed.

#### Step 2: Write Tests for One Class

**Writing tests:**
- Group tests by behavior using section comments:
  - `# Happy path`
  - `# Invalid input`
  - `# Edge cases (empty, max size, boundary values)`
- Use behavior-style names: `test_should_return_error_when_input_is_negative`

**Stop: Test class complete** — Show all test functions, then generate a compact review summary (under 1 minute to read):

1. **Behavior coverage**: Bullet list of which behavior categories are covered vs. missing
   - Example: "Covered: happy path, invalid input. Missing: large input size, boundary values."
2. **Test style note**: Whether tests target public behavior (per design) vs. implementation details; whether parametrization/fixtures are used helpfully
3. **Suggested additions** (1–3 concrete tests):
   - Boundary cases (min/max, empty)
   - Performance/large-input case if size matters
   - Key invalid or malformed input
4. **Decision point**: "Add these tests now, or proceed to implementation?"

If adding tests: generate only those tests, stop again for review. Otherwise, proceed to implementation.

#### Step 3: Implement Module/Class

**After making tests pass (Green):**

**Stop: Implementation complete** — Generate two short summaries (under 2 minutes total to read):

**1. What was implemented:**
- New/changed public functions/classes:
  - Name, parameters (with types), return type
  - One-sentence responsibility in plain language
- Where it fits in data flow: "This is step X of the data flow: [brief description]"

**2. Standards checklist** (mark each as "OK" or "Check"):
- ✓ Type hints on all new/modified functions
- ✓ Error handling consistent with `docs/DECISIONS.md` (e.g., ValueError with clear messages)
- ✓ No unnecessary abstraction for this assignment's scale
- ✓ Code behavior matches test descriptions (no hidden responsibilities)

If any item is "Check", explain why briefly and ask: "Propose a small refactor now, or leave as-is and proceed?"

**3. Interview rehearsal (after completing a core module or major chunk):**
- 3–5 likely interview questions about this code
- Clearly separate "Questions (for you to practice)" and "Sample answers (reference only)"

#### Step 4: Refactor (if needed)

While keeping tests passing, clean up code. Commit after Green or Refactor step.

#### Step 5: Repeat

Next test class or test file, using the implementation checklist from `docs/DESIGN.md` to track progress.

**For large assignments:** Show progress summary after each module/class is complete (which checklist items are done, which remain).

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
- **Frequent review stops during TDD** — for large assignments, you'll review after each test class and after each module/class implementation. This keeps the scope visible and manageable.
- **One failing test per commit** in the TDD phase. Write test → make it fail → implement → make it pass → commit.
- **Type hints on all function signatures** — non-negotiable.
- **Test names describe behavior** — use `test_should_return_error_when_...` pattern.
- **Commit after every Green or Refactor step** — not just at the end.
- **Design conciseness** — the design doc should be brief and actionable, not encyclopedic. Assume the reader can code.

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
