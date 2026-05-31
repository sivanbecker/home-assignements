# Skill: code-graph-scout

Purpose: understand the implemented codebase structurally before reviewing logic. Build a graph-first view of the repo using Nx and dependency-cruiser, then hand clean artifacts to downstream skills.

When to use:
- The repo has already been implemented and you want to review architecture or dependencies.
- You want a quick structural map before code review.
- You suspect AI-generated code added hidden coupling or odd boundaries.
- The repo is JS/TS or contains enough Nx structure to benefit from project graph analysis.

Primary goals:
1. Produce a workspace/project-level graph.
2. Produce a file/module-level dependency graph.
3. Identify review-worthy hotspots before opening many files.
4. Save outputs in stable text formats for later Mermaid rendering and review.

Assumptions:
- Prefer Nx when available for project/workspace graphing.
- Prefer dependency-cruiser for file/module imports in JS/TS.
- Treat the graph as evidence, not truth; confirm with source when something looks odd.

Workflow:
1. Detect available tools and repo shape.
2. Generate Nx project graph if Nx is present.
3. Generate dependency-cruiser output if applicable.
4. Normalize findings into a compact architecture summary.
5. Hand off to Mermaid and review skills.

Detection checklist:
- Check for `nx.json`, `project.json`, `workspace.json`, or Nx packages.
- Check for `package.json`, `tsconfig.json`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`.
- Check for `.dependency-cruiser.js`, `.dependency-cruiser.cjs`, or dependency-cruiser in package.json.
- Identify apps, libs, packages, feature folders, shared folders, test folders.
- Note whether the repo is monorepo, single package, or “small assignments repo with repeated exercises”.

Commands to prefer:
- `nx graph`
- `nx graph --focus=<project>`
- `nx graph --file=output.json`
- `nx graph --print`

Why these:
- Nx can open the project graph, focus on a project and its ancestors/descendants, print JSON, and save the graph to JSON or HTML. Use JSON for downstream processing and HTML only when a visual artifact is directly useful.

dependency-cruiser commands to prefer:
- `depcruise src --output-type json`
- `depcruise . --include-only "^src" --output-type json`
- `depcruise . --config .dependency-cruiser.js --output-type json`
- `depcruise src --config .dependency-cruiser.js --output-type plugin:dependency-cruiser/mermaid-reporter-plugin`

Use the Mermaid reporter only when you want a first-pass graph quickly. Prefer JSON when another skill will curate a smaller human-friendly diagram.

What to extract:
- Projects/packages and their dependencies.
- Cycles.
- Highly depended-on modules.
- Modules with many outgoing imports.
- Cross-boundary imports, especially feature-to-feature and app-to-app.
- Shared modules that became junk drawers.
- Tests importing internals they should not know about.
- Infra/UI/domain mixing.

Hotspot heuristics:
- A node with very high in-degree is a change-risk magnet.
- A node with very high out-degree may be over-orchestrating.
- A cycle is review-worthy even if it “works”.
- “shared”, “utils”, “common”, “helpers”, “base”, “core” often hide poor boundaries.
- Excessive cross-feature imports usually mean weak module ownership.
- AI-generated code often creates duplicate helper layers, shallow wrappers, and wide but meaningless abstractions.

Required outputs:
1. Repo shape summary:
   - monorepo or single package
   - detected apps/libs/packages
   - main languages
   - likely review scope
2. Nx graph summary:
   - top projects by centrality
   - focus candidates
   - suspicious edges
3. dependency-cruiser summary:
   - top file-level hubs
   - cycles
   - questionable imports
4. Recommended next diagram set:
   - workspace map
   - focused feature map
   - risky dependency map

Output style:
- Be concise and evidence-driven.
- Prefer bullets over prose.
- Name exact files/projects when possible.
- Separate “observed” from “inferred”.

Guardrails:
- Do not dump giant graphs into chat.
- Do not claim an architectural problem without naming the edge/path that suggests it.
- If graph data is too noisy, propose narrower scopes by project, feature, or path.
- If Nx is absent, continue with dependency-cruiser or another language-appropriate fallback.
- If dependency-cruiser is absent, suggest install/config steps but still use Nx if available.

Handoff format:
Produce:
- `Repo shape`
- `Graph findings`
- `Review hotspots`
- `Suggested Mermaid diagrams`
- `Questions to narrow scope`

Questions to ask when needed:
- Which assignment/project in the repo should be the review target?
- Should the diagram be project-level, file-level, or both?
- Do you want architectural smell detection, onboarding diagrams, or PR review support?