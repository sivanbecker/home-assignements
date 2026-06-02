# Skill: code-review-architecture

Purpose: use structural graphs and Mermaid diagrams to make review sharper, especially when AI wrote much of the code.

When to use:
- You are reviewing implemented code and want architectural guidance, not just syntax comments.
- You want to catch coupling, leaky boundaries, duplication patterns, and "looks fine locally, bad globally" problems.
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
8. Scale-out readiness

How to review from graphs:
- Start repo-level: where is the center of gravity?
- Move to focused feature: does the target feature depend only on what it should?
- Check cycles and back-edges.
- Inspect shared modules: are they true shared primitives or dumping grounds?
- Inspect infra reach: are UI/feature modules touching infra directly?
- Inspect tests: are they coupled to internals rather than behavior?
- Compare intended layers with actual edges.
- **Scale lens:** identify which nodes would be the first bottleneck under 10× load; check whether I/O and storage dependencies are injectable or hardwired.

Smells to call out:
- Feature imports another feature's internals.
- Shared imports feature code.
- App layer knows too much about implementation details.
- A "utils" module has high in-degree and mixed responsibilities.
- Many tiny wrappers around simple library calls.
- Repeated parallel structures across assignments that do not buy clarity.
- Test helpers becoming production dependencies or vice versa.
- One service/repository/controller doing too much orchestration.
- Cycle formed by "just one convenient import".
- Folder names imply layers, but edges violate them.
- **Scale smells:** a module that owns both data storage AND business logic (hardcoded `new Map()` alongside domain transforms); a sync function that reads all input before yielding any output; a module-level mutable singleton that all other modules import.

AI-specific suspicion patterns:
- Abstractions introduced before need.
- Near-duplicate services with slightly different names.
- Generic helper files with vague names and wide usage.
- Over-splitting into many files with shallow logic.
- Dependency direction that looks symmetrical rather than intentional.
- One "core" module touching almost everything.

Scale-out review checklist (apply to every architecture review):
Answer each question from graph evidence. Skip those that are genuinely not applicable to the domain.

1. **I/O boundary**: Are all file, network, and DB calls confined to a single layer (typically the entry point or a repository module)? Or do I/O edges appear in the middle of the graph, tangled with business logic?
2. **Storage seam**: Does the graph show a storage/repository abstraction that can be swapped? Or is the storage implementation (e.g., a `Map`, a file path) hardwired into the core module?
3. **Stateful singletons**: Are there module-level exports that hold mutable state? If yes, flag: these prevent horizontal scaling (multiple instances would have divergent state) and make tests order-dependent.
4. **Hot-path complexity**: For the module with the highest in-degree (the one most code depends on), what is the likely time complexity of its main operation? Flag any O(N²) or worse that would become the first bottleneck.
5. **Sync blocking risk**: Is there any node that reads all input synchronously before producing output? At what input size does this become a problem? Suggest an async-iteration boundary if the domain warrants it.
6. **Interface vs. implementation coupling**: Do call sites import concrete classes or interface types? Concrete-only imports are a scale lock-in; interface imports allow swapping implementations.
7. **Partition tolerance**: If the assignment involves state, is all state in one place (single process, single structure)? Note this as a known limit and the minimum change (e.g., "extract behind a `Store<K,V>` interface") that would unlock distributed storage.

Required output structure:
1. `Structural summary`
2. `Review priorities`
3. `Likely risks`
4. `Scale-out observations` — findings from the scale-out checklist above; one bullet per applicable item; mark items as "not applicable" rather than omitting them
5. `Questions for the implementer` — always include at least one scaling question, e.g. "If this had to run on two servers simultaneously, which module would break first and why?"
6. `Suggested refactors`
7. `Mermaid diagrams to inspect`

Review comment style:
- Tie every concern to a node, edge, path, or cycle.
- Phrase findings as reviewable observations, not verdicts.
- Distinguish correctness risk from maintainability risk from scale risk.
- Rank issues: high, medium, low.

Example review comments:
- "`feature-orders -> feature-users/internal/*` suggests cross-feature reach into internals; review whether this should go through a public interface instead."
- "`shared/utils` is a high in-degree hub across unrelated features; inspect for mixed responsibilities and hidden coupling."
- "The cycle `task-service -> task-repo -> task-mapper -> task-service` is likely increasing change cost and test complexity."
- "UI components depending directly on `api-client` bypass the service seam and may make testing and future refactors harder."
- "`store.ts` exports a module-level `const registry = new Map()` imported by three other modules — this is a mutable singleton; it prevents running two instances side-by-side and makes test isolation fragile."
- "`processAll()` in `core.ts` reads the entire input array before returning — at 1M records this would OOM; consider converting to an async iterator or processing in pages."
- "Storage is hardwired as `new Map<string, Item>()` inside `ItemService` with no abstraction; swapping to Redis would require changing the class internals rather than swapping a dependency."

Decision heuristics:
- A dependency is more acceptable if it points inward to stable primitives.
- A dependency is riskier if it points sideways into peer feature internals.
- Shared modules should mostly contain stable types, pure helpers, or simple contracts.
- The bigger the node and the more edges it has, the higher the review payoff.
- An injectable interface over storage/transport costs very little at assignment scale and unlocks scale-out later — prefer it unless the problem is genuinely single-process only.

Questions to ask:
- What architecture was expected for this assignment?
- Which project or feature matters most right now?
- Do you want comments optimized for PR review, refactoring, or interview debrief?
- Should the review prefer simplicity, strict layering, or speed of iteration?
- What is the expected scale context — single process, multi-process, distributed?

Guardrails:
- Do not over-police a tiny exercise repo with enterprise standards.
- Prefer "smallest useful refactor".
- If the assignment intentionally chose a simple structure, do not demand a large architecture.
- Separate educational suggestions from must-fix issues.
- Scale findings are **educational observations**, not blockers, unless the assignment explicitly requires scale. The goal is to help the candidate articulate the limits of their choices — not to demand production infrastructure in a home assignment.
