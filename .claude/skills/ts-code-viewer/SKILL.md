# Skill: ts-code-viewer

Purpose: produce a self-contained review package for a TypeScript assignment by orchestrating three sub-skills — graph scouting, Mermaid diagram generation, and architectural review — then writing the results into `docs/` files inside the assignment folder.

When to use:
- After an assignment has been implemented and you want a structural + architectural view before or during review.
- When you want persistent Markdown artifacts in the assignment repo (renderable in VS Code, GitHub, mermaid.live).
- When preparing for an interview debrief or code walkthrough.

## What this skill produces

Two files written into `assignments/<name>/docs/`:

| File | Contents |
|---|---|
| `docs/ARCHITECTURE.md` | Mermaid diagrams: layered architecture, actual import graph, risk map. Module summary table. |
| `docs/REVIEW.md` | Architectural review findings: structural summary, review priorities, risks, questions for the implementer, suggested refactors. |

## How it works

This skill runs three sub-skills in sequence and synthesizes their output into the two doc files.

### Step 1 — code-graph-scout

Run the `ts-code-graph-scout` skill on the assignment.

Collect:
- Repo shape (single package vs monorepo)
- All modules and their import edges
- In-degree / out-degree per module
- Cycles (if any)
- Hotspot candidates (high centrality nodes)
- Any boundary violations

If `dependency-cruiser` is not installed, install it as a dev dependency:
```bash
cd assignments/<name> && npm install --save-dev dependency-cruiser
```

Then run:
```bash
./node_modules/.bin/depcruise src --no-config --output-type json --ts-config tsconfig.json
```

Parse the JSON to extract modules, dependencies, and dependents.

### Step 2 — code-graph-mermaid

Using the scout findings, generate three diagrams:

1. **Layered architecture map** (`flowchart TD`) — group modules into subgraphs by layer (Tests / Public API / Domain Logic / Data Model / Infra). Show intended dependency direction.

2. **Actual import graph** (`graph LR`) — show exact edges as observed by dependency-cruiser. Annotate violations or bypasses.

3. **Risk map** — show any boundary violations, cycles, or suspicious imports with `⚠️` labels. If none exist, show the clean state and note it explicitly. If a boundary was previously violated and fixed, show the before-state for interview discussion.

Rules:
- Max 20 nodes per diagram.
- Use subgraphs to group by layer.
- Annotate edges that cross layer boundaries unexpectedly.
- Add 2-4 bullet notes under each diagram.

### Step 3 — code-review-architecture

Using scout findings + diagrams, produce a structured architectural review:

1. **Structural summary** — What layers exist? Is the dependency direction clean? What is the center of gravity?
2. **Review priorities** — Ranked list (high / medium / low) of structural observations. Tie each to a specific file, edge, or node.
3. **Likely risks** — Correctness risks vs. maintainability risks. Distinguish clearly.
4. **Questions for the implementer** — 3-5 questions a reviewer or interviewer would ask about the architecture.
5. **Suggested refactors** — Only what is proportionate to the assignment size. Do not over-engineer recommendations.

### Step 4 — Write docs

Write two files:

**`docs/ARCHITECTURE.md`**
```
# Architecture

## Layered Architecture
<diagram 1 + bullets>

## Actual Import Graph
<diagram 2 + bullets>

## Risk Map
<diagram 3 + bullets>

## Module Summary
<table: module | layer | exports | dependents>
```

**`docs/REVIEW.md`**
```
# Architectural Review

## Structural Summary
<paragraph>

## Review Priorities
<ranked list>

## Likely Risks
<correctness vs. maintainability>

## Questions for the Implementer
<numbered list>

## Suggested Refactors
<numbered list, proportionate>
```

## Output confirmation

After writing both files, confirm:
- File paths written
- How to view diagrams (VS Code Mermaid extension, mermaid.live, GitHub preview)
- Which findings are most worth discussing in an interview or PR review

## Guardrails

- Do not install dependency-cruiser globally — dev dependency only.
- Do not generate diagrams with more than 20 nodes.
- Do not apply enterprise-scale architectural standards to a small assignment.
- Distinguish "must fix" from "worth discussing" in all review output.
- If the graph is already clean, say so explicitly rather than inventing problems.
- If an assignment has no `src/` folder or no TypeScript files, report clearly and stop.

## Example invocation

```
/ts-code-viewer
```

The skill targets the assignment in the current working directory, or the most recently worked-on assignment in the `assignments/` folder if run from the repo root.
