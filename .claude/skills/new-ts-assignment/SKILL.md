---
name: new-ts-assignment
description: "Create and scaffold a new TypeScript home assignment with TDD workflow. Use when: starting a new assignment, setting up project structure, guiding through intake → design → implementation → debrief"
type: workflow
---

# New TypeScript Assignment Workflow

This skill automates the setup and guides you through the complete TDD-driven TypeScript assignment process.

## What This Skill Does

1. **Scaffolds folder structure** under `assignments/`
2. **Guides through Intake phase** — parse requirements, document questions
3. **Standards Review** — confirm technical decisions (validation, error handling, data modeling)
4. **Design phase** — architecture, data flow, and **scaling analysis**
5. **TDD Execution** — write tests, implement, refactor with commit checkpoints
6. **Debrief** — document patterns, tradeoffs, scaling gaps, and learnings

## Scaling Philosophy

Most home assignments are small — tens of records, a single process, in-memory state. That is intentional. But an interviewer who asks "what would you change if this had to handle 10 million records?" is really asking: *do you understand the constraints you accepted, and can you articulate the path to removing them?*

Apply this lens at **every phase**:

- **Intake / Questions**: identify the single biggest scaling unknown (data volume? concurrency? state sharing?)
- **Design**: make scaling-sensitive choices visible (in-memory vs. injectable store, sync vs. async, single-pass vs. multi-pass)
- **Implementation**: write code that is honest about its current scale limits — don't fake infinite scale, but don't make scale-out impossible either
- **Review stop points**: call out any O(N²) logic, in-memory state that would need extraction, or sync code that would block at load
- **Debrief**: name the concrete "if scale mattered, I would change X to Y" moves — this is high-value interview content

The goal is **scale-aware, not over-engineered**. A three-line in-memory Map is the right call; documenting why it would be replaced with Redis at 100k users is what makes it senior-level.

---

## Workflow

### Phase 1: Setup & Intake (Fast Intake Mode — 10–15 minutes)

**Input:** assignment name and description

**Before starting:**
- Create a new git branch named `work/<assignment-name>`

**docs/INTAKE.md (compact, under 3 minutes to read):**
1. **Functional requirements** — bullet list of behaviors only (no implementation details)
2. **Constraints and edge cases** — bullet list of limits, input quirks, special cases
3. **Scale context** — one bullet: *what is the implied scale of this assignment?* Examples: "single user, in-memory, no persistence needed", "batch job over a file", "API that could serve many concurrent clients". State it explicitly so design decisions are grounded.

**docs/QUESTIONS.md (3–5 high-impact questions only):**
- Select only 3–5 questions with the biggest design impact, typically from:
  - **Input size / performance** — always include one scaling question, e.g. "What is the expected data volume? Hundreds, millions, streaming?"
  - Error handling strategy (throw vs. return Result type vs. null)
  - Exact output format (ordering, rounding, encoding)
  - Persistence (state across runs) if relevant
  - Concurrency / async (Promise-based vs. sync) if relevant
- For each question, add an "assumption stub" line so you can document assumptions if you don't ask the interviewer
- Add a final section:
  - "Recommended questions to ask interviewer" (1–3 with biggest impact)
  - "Questions to convert into explicit assumptions" (the rest)

**Output:**
- Folder structure: `assignments/<assignment-name>/`
- Stub files: `assignment.md`, `src/`, `src/__tests__/`, `docs/`
- Initial documentation: `docs/INTAKE.md`, `docs/QUESTIONS.md`
- Config files: `package.json`, `tsconfig.json`, `jest.config.ts`

**Stop point:** Wait for user to answer questions in `docs/QUESTIONS.md`

---

### Phase 2: Standards Review (5–10 minutes)

**Default Standards Profile (assume unless assignment clearly needs deviation):**
- **Input validation:** Manual type guards or small Zod schemas (not heavy class-based validation unless complex structured data)
- **Error handling:** Throw typed errors (`class DomainError extends Error`) for unexpected failures; return `null` or a discriminated union for expected failures
- **Data modeling:** Plain interfaces or small `type` aliases; use `readonly` arrays and properties where data shouldn't be mutated
- **Async vs sync:** Synchronous only, unless the assignment explicitly involves I/O, timers, or external APIs
- **Testing pattern:** Plain `describe`/`it` blocks with `expect`; use `test.each` only when it clearly improves readability

**Review process:**
- Assume this default profile for the assignment
- Only propose deviations when the assignment text clearly justifies it
- Document the rationale briefly

**Output:**
- `docs/DECISIONS.md` — at most 8 short bullet points summarizing chosen options and rationale (readable in under 2 minutes)
- `docs/TRADEOFFS.md` — stub created here with one entry per decision in `DECISIONS.md`. Format per entry:
  ```
  ## <Decision Name>
  **Choice:** <what was chosen>
  **Tradeoff:** <what you gain> vs. <what you give up>
  **Why here:** <one sentence on why this choice fits this assignment>
  **Scale note:** <one sentence on what breaks first if scale grows — or "not a scaling concern" if genuinely not>
  ```

**Stop point:** After writing `docs/DECISIONS.md` and `docs/TRADEOFFS.md`, stop and wait for user review before proceeding to Design phase

---

### Phase 3: Design (Tiny, Executable Design — under 3 minutes to read)

**Step 0: Map the existing codebase** — Before designing anything, run `/ts-code-graph-mermaid` to generate a Mermaid diagram of the current source tree. Present it in chat so both parties have a shared visual of what already exists. Use it as the anchor when deciding where new modules slot in and which existing files need to be extended.

**Size constraints:**
- Maximum 3 modules
- Maximum 5 total functions/classes
- No long prose; keep everything tight and action-oriented

**Module structure (prefer simple patterns like):**
- An entry point or CLI layer
- A core logic layer
- Optionally a small types/models layer
- If the problem is small, merge modules to keep structure minimal

**Produce `docs/DESIGN.md` with these sections:**

1. **Module breakdown** — for each module:
   - Name and responsibility (one sentence)
   - What it exports (function/class/type names only)

2. **Function/class signatures** — for each major component:
   - Name
   - Parameters with TypeScript types
   - Return type
   - One-sentence responsibility in plain language

3. **Data flow** — numbered list of 4–8 steps (no paragraphs), example:
   - 1: Read input from X
   - 2: Validate/parse into Y
   - 3: Transform Y into Z via core logic
   - 4: Format Z into final output

4. **Scaling analysis** — one compact table (max 6 rows). For each significant component or decision, answer:

   | Component / Decision | Current approach | Scale limit | Path to scale |
   |---|---|---|---|
   | State storage | In-memory Map | Single process, ~100k entries before GC pressure | Extract behind a `Repository` interface; swap with Redis/DB implementation |
   | Input parsing | Sync, full read | Fine up to ~10MB files | Switch to streaming (`readline` / async iterator) for large files |
   | Core algorithm | O(N log N) sort | Fine up to millions of items in memory | Out-of-core sort or push sort to DB if memory-constrained |
   | API layer | Single-threaded sync | Single user only | Add async + connection pooling; extract I/O to boundaries |

   Rules:
   - Only include rows where there is a *real* limit worth naming
   - "Not a scaling concern for this domain" is a valid and complete answer for some rows — don't manufacture fake concerns
   - Keep "path to scale" to one sentence — this is a conversation prompt, not an implementation plan

5. **Implementation checklist** — all modules, functions, classes to be built:
   - Mark each as "must-have" or "nice-to-have"
   - Use this to track progress during TDD and manage time

6. **Pre-implementation Mermaid diagrams** — generate and embed in `docs/DESIGN.md`:

   **Layered architecture** (`flowchart TD`) — planned layers and module relationships before any code is written:
   ```mermaid
   flowchart TD
     subgraph "Public API"
       index["index.ts"]
     end
     subgraph "Domain Logic"
       core["coreModule.ts"]
     end
     subgraph "Data Model"
       types["types.ts"]
     end
     index --> core
     index --> types
     core --> types
   ```

   **Planned class diagram** (`classDiagram`) — planned classes, interfaces, key methods, and relationships:
   ```mermaid
   classDiagram
     class MainClass {
       +methodA(param) ReturnType
       +methodB(param) ReturnType
     }
     class DomainEntity {
       +field type
     }
     class DomainError {
       +message string
     }
     MainClass ..> DomainEntity : creates
     MainClass ..> DomainError : throws
     Error <|-- DomainError
   ```

   **Planned call-flow** (`flowchart TD`) — one diagram per major public method showing the intended internal steps and error branches:
   ```mermaid
   flowchart TD
     methodA --> validate{valid input?}
     validate -->|yes| process[process input]
     validate -->|no| throwError[throw DomainError]
     process --> store[store result]
     store --> returnResult[return result]
   ```

   Rules for pre-implementation diagrams:
   - Use planned names, not stubs — diagram what you intend to build
   - Mark all diagrams as "planned" in a subtitle line
   - Keep to max 12 nodes per diagram
   - These diagrams are the primary review artifact at the Design stop point

**Append to `docs/TRADEOFFS.md`** — for each significant design decision made during this phase (module split, data flow choices, interface shape), add a new entry using the same format established in Phase 2 (including the `Scale note` field).

**Stop point:** Present the design doc including all three Mermaid diagrams, the scaling analysis table, and the updated `TRADEOFFS.md`. Wait for user approval before writing tests.

---

### Phase 4: TDD Execution — Pattern-Based Review at Every Stop

For each test file and corresponding implementation:

#### Step 1: Create Test File

**Stop: Test file creation** — Show test file path and scope (which module/classes being tested), wait for approval to proceed.

#### Step 2: Write Tests for One Describe Block

**Writing tests:**
- Group tests using nested `describe` blocks by behavior:
  - `describe('happy path', ...)`
  - `describe('invalid input', ...)`
  - `describe('edge cases (empty, max size, boundary values)', ...)`
- Use behavior-style names: `it('should return an error when the input is negative', ...)`
- Include at least one test for a **large or repeated input** if the component has a scaling concern identified in the design's scaling analysis table — even if it is just a timing assertion with a generous timeout, or a correctness test on N=10,000 items

**Stop: Describe block complete** — Show all test functions, then generate a compact review summary (under 1 minute to read):

1. **Behavior coverage**: Bullet list of which behavior categories are covered vs. missing
   - Example: "Covered: happy path, invalid input. Missing: large input size, boundary values."
2. **Test style note**: Whether tests target public behavior (per design) vs. implementation details; whether `test.each`/fixtures are used helpfully
3. **Suggested additions** (1–3 concrete tests):
   - Boundary cases (min/max, empty, undefined/null)
   - Performance/large-input case if scaling analysis flagged this component
   - Key invalid or malformed input
4. **Decision point**: "Add these tests now, or proceed to implementation?"

If adding tests: generate only those tests, stop again for review. Otherwise, proceed to implementation.

#### Step 3: Implement Module/Class

**After making tests pass (Green):**

**Stop: Implementation complete** — Generate two short summaries (under 2 minutes total to read):

**1. What was implemented:**
- New/changed exported functions/classes/types:
  - Name, parameters (with types), return type
  - One-sentence responsibility in plain language
- Where it fits in data flow: "This is step X of the data flow: [brief description]"

**2. Standards checklist** (mark each as "OK" or "Check"):
- ✓ TypeScript strict mode — no `any`, no `as unknown`, no type assertions unless justified
- ✓ All exported functions have explicit return types
- ✓ Error handling consistent with `docs/DECISIONS.md`
- ✓ No unnecessary abstraction for this assignment's scale
- ✓ Code behavior matches test descriptions (no hidden responsibilities)
- ✓ **Scaling honesty** — if this component has a scale limit (per the Design scaling analysis), is the limit respected in code (no silent data truncation, no unbounded array growth without comment)?

If any item is "Check", explain why briefly and ask: "Propose a small refactor now, or leave as-is and proceed?"

**3. Post-implementation Mermaid diagrams** (after each module/class is fully green):

Generate and embed updated diagrams directly in the stop summary (not in a file — just in chat for quick review):

- **Updated class diagram** — actual class/interface/method names now that implementation is complete. Compare to the planned diagram in `docs/DESIGN.md`: did anything change?
- **Call-flow for the implemented method** (`flowchart TD`) — actual internal steps as coded, including real branching and error paths
- **Sequence diagram for the main path** — test → index.ts → class → types, showing the actual execution order

If the implemented diagrams match the planned ones in `docs/DESIGN.md`: note "implementation matches design".
If they diverge: highlight the delta and ask "Update DESIGN.md to reflect the actual implementation, or refactor to match the plan?"

**4. Interview rehearsal (after completing a core module or major chunk):**
- 3–5 likely interview questions about this code
- Always include at least one scaling question, e.g.:
  - "This uses an in-memory Map — what would you change if this needed to run across multiple servers?"
  - "What is the time complexity of this algorithm, and at what input size would it become a bottleneck?"
  - "How would you handle 10× the current load without changing the public API?"
- Clearly separate "Questions (for you to practice)" and "Sample answers (reference only)"

#### Step 4: Refactor (if needed)

While keeping tests passing, clean up code. Commit after Green or Refactor step.

#### Step 5: Repeat

Next describe block or test file, using the implementation checklist from `docs/DESIGN.md` to track progress.

**For large assignments:** Show progress summary after each module/class is complete (which checklist items are done, which remain).

---

### Phase 5: Post-Implementation Docs + Debrief

**Step 1: Run `/ts-code-viewer`** — Before writing the debrief, run `/ts-code-viewer` to generate the three post-implementation docs:
- `docs/ARCHITECTURE.md` — module-level diagrams (layered architecture, actual import graph, risk map)
- `docs/INTERNALS.md` — class diagram, call-flow diagrams, review slices
- `docs/REVIEW.md` — architectural review findings (priorities, risks, refactor suggestions)

**Step 2: Finalize `docs/TRADEOFFS.md`** — Add a closing `## Summary` section at the bottom:
```
## Summary
List the 2–3 tradeoffs that had the biggest impact on the final design, and whether you'd make the same call again.

## Scaling Summary
For each row in the Design scaling analysis: did the implementation stay honest to its stated limits? If any limit was breached silently (e.g., unbounded in-memory growth, O(N²) slipped in), flag it here.
```

**Step 3: Produce `docs/DEBRIEF.md`**:
- Per-module explanation of what was built and why
- Patterns used (factory, builder, composition, etc.)
- What you'd change with more time
- Lessons learned
- **Scaling retrospective** (required section):
  - Which components are the first bottlenecks under load?
  - What is the minimum change to each to unlock the next order of magnitude?
  - What architectural decisions made scale-out easy vs. hard?
  - Example format:
    ```
    ## Scaling Retrospective
    | Component | Current limit | Minimum change to scale | Architectural enabler |
    |---|---|---|---|
    | UserStore | ~100k in-memory | Extract behind Repository interface | Dependency injection already in place |
    | processAll() | O(N²) nested loop | Replace inner lookup with Map | Pure function — easy to swap |
    ```

**Final output:** Ready for PR review

---

## Quick Start

```
/new-ts-assignment
```

Then follow the prompts. The skill will:
- Create the folder structure
- Ask for assignment name and description
- Initialize stub files and config
- Guide you through each phase with explicit stop points

## Key Files Referenced

- **CLAUDE.md** — Full TDD workflow and principles
- **STANDARDS.md** — Technical decision options with tradeoffs
- Per-assignment docs:
  - `docs/INTAKE.md` — Requirements, constraints, edge cases, scale context
  - `docs/QUESTIONS.md` — Clarifying questions for user input (always includes scaling question)
  - `docs/DECISIONS.md` — Confirmed technical choices
  - `docs/TRADEOFFS.md` — Living tradeoff log: one entry per key decision, grows through Standards → Design → Debrief (each entry has a `Scale note`)
  - `docs/DESIGN.md` — Architecture, design, **pre-implementation Mermaid diagrams**, and **scaling analysis table**
  - `docs/ARCHITECTURE.md` — Post-implementation module graph diagrams (written by `/ts-code-viewer`)
  - `docs/INTERNALS.md` — Post-implementation class, call-flow, and slice diagrams (written by `/ts-code-viewer`)
  - `docs/REVIEW.md` — Architectural review findings (written by `/ts-code-viewer`)
  - `docs/DEBRIEF.md` — Retrospective, learnings, and **scaling retrospective table**

## Important Notes

- **Follow the stop points** — don't skip ahead. Each phase builds on the previous one.
- **Frequent review stops during TDD** — review after each describe block and after each module/class implementation.
- **One failing test per commit** in the TDD phase. Write test → make it fail → implement → make it pass → commit.
- **No `any`** — non-negotiable. Use `unknown` + type guards, or proper generics.
- **Explicit return types** on all exported functions.
- **Test names describe behavior** — use `it('should return ... when ...')` pattern.
- **Commit after every Green or Refactor step** — not just at the end.
- **Design conciseness** — the design doc should be brief and actionable, not encyclopedic.
- **Scale-aware, not over-engineered** — never add premature abstractions "for scale". Instead, name the current limit and the one-step change that would remove it. Write code that makes that future change cheap (e.g., keep I/O at the edges, keep core logic pure).

## Directory Structure After Setup

```
assignments/
└── <assignment-name>/
    ├── assignment.md           # Original assignment prompt
    ├── package.json
    ├── tsconfig.json
    ├── jest.config.ts
    ├── docs/
    │   ├── INTAKE.md           # Requirements, constraints, edge cases, scale context
    │   ├── QUESTIONS.md        # Clarifying questions (user fills in answers)
    │   ├── DECISIONS.md        # Confirmed technical decisions
    │   ├── TRADEOFFS.md        # Living tradeoff log (Standards → Design → Debrief, with Scale notes)
    │   ├── DESIGN.md           # Architecture, design + pre-impl Mermaid diagrams + scaling analysis
    │   ├── ARCHITECTURE.md     # Post-impl module graph (written by /ts-code-viewer)
    │   ├── INTERNALS.md        # Post-impl class/callflow/slices (/ts-code-viewer)
    │   ├── REVIEW.md           # Architectural review (/ts-code-viewer)
    │   └── DEBRIEF.md          # Retrospective (end of project) + scaling retrospective
    └── src/
        ├── index.ts            # Entry point / public API
        ├── *.ts                # Domain logic modules
        └── __tests__/
            └── *.test.ts       # Test files (one per domain module)
```

## Environment

- **TypeScript:** 5.x, `strict: true` (non-negotiable)
- **Package manager:** `pnpm` (`pnpm add`, `pnpm run`)
- **Testing:** `jest` + `ts-jest` (`pnpm test`)
- **Linting:** `eslint` with `@typescript-eslint` (`pnpm lint`)
- **Type checking:** `tsc --noEmit` (`pnpm typecheck`)

Run tests early and often. Type checking and linting should pass before committing.

## Config Stubs

**`tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**`jest.config.ts`:**
```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
};

export default config;
```

**`package.json` (scripts section):**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts",
    "build": "tsc"
  }
}
```
