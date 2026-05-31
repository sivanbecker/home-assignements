# Skill: code-review-architecture

Purpose: use structural graphs and Mermaid diagrams to make review sharper, especially when AI wrote much of the code.

When to use:
- You are reviewing implemented code and want architectural guidance, not just syntax comments.
- You want to catch coupling, leaky boundaries, duplication patterns, and “looks fine locally, bad globally” problems.
- You want a review companion that turns graph evidence into concrete review questions.

Core idea:
AI-generated code often passes tests yet creates weak structure: extra abstraction layers, duplicated helper modules, broad shared utilities, accidental cycles, and feature leakage. Review the shape of the system, not only the correctness of functions.

Inputs:
- Findings from code-graph-scout
- Mermaid diagrams from code-graph-mermaid
- Optional assignment brief or expected architecture
- Optional coding constraints from your implementation skills

Review lens:
1. Boundary integrity
2. Dependency direction
3. Cohesion and coupling
4. Hotspot concentration
5. Testability seams
6. Duplication-by-abstraction
7. Reviewability by humans

How to review from graphs:
- Start repo-level: where is the center of gravity?
- Move to focused feature: does the target feature depend only on what it should?
- Check cycles and back-edges.
- Inspect shared modules: are they true shared primitives or dumping grounds?
- Inspect infra reach: are UI/feature modules touching infra directly?
- Inspect tests: are they coupled to internals rather than behavior?
- Compare intended layers with actual edges.

Smells to call out:
- Feature imports another feature’s internals.
- Shared imports feature code.
- App layer knows too much about implementation details.
- A “utils” module has high in-degree and mixed responsibilities.
- Many tiny wrappers around simple library calls.
- Repeated parallel structures across assignments that do not buy clarity.
- Test helpers becoming production dependencies or vice versa.
- One service/repository/controller doing too much orchestration.
- Cycle formed by “just one convenient import”.
- Folder names imply layers, but edges violate them.

AI-specific suspicion patterns:
- Abstractions introduced before need.
- Near-duplicate services with slightly different names.
- Generic helper files with vague names and wide usage.
- Over-splitting into many files with shallow logic.
- Dependency direction that looks symmetrical rather than intentional.
- One “core” module touching almost everything.

Required output structure:
1. `Structural summary`
2. `Review priorities`
3. `Likely risks`
4. `Questions for the implementer`
5. `Suggested refactors`
6. `Mermaid diagrams to inspect`

Review comment style:
- Tie every concern to a node, edge, path, or cycle.
- Phrase findings as reviewable observations, not verdicts.
- Distinguish correctness risk from maintainability risk.
- Rank issues: high, medium, low.

Example review comments:
- “`feature-orders -> feature-users/internal/*` suggests cross-feature reach into internals; review whether this should go through a public interface instead.”
- “`shared/utils` is a high in-degree hub across unrelated features; inspect for mixed responsibilities and hidden coupling.”
- “The cycle `task-service -> task-repo -> task-mapper -> task-service` is likely increasing change cost and test complexity.”
- “UI components depending directly on `api-client` bypass the service seam and may make testing and future refactors harder.”

Decision heuristics:
- A dependency is more acceptable if it points inward to stable primitives.
- A dependency is riskier if it points sideways into peer feature internals.
- Shared modules should mostly contain stable types, pure helpers, or simple contracts.
- The bigger the node and the more edges it has, the higher the review payoff.

Questions to ask:
- What architecture was expected for this assignment?
- Which project or feature matters most right now?
- Do you want comments optimized for PR review, refactoring, or interview debrief?
- Should the review prefer simplicity, strict layering, or speed of iteration?

Guardrails:
- Do not over-police a tiny exercise repo with enterprise standards.
- Prefer “smallest useful refactor”.
- If the assignment intentionally chose a simple structure, do not demand a large architecture.
- Separate educational suggestions from must-fix issues.