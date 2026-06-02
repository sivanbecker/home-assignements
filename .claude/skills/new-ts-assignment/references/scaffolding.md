# Scaffolding Reference

Use this file during Phase 1 (Setup) when creating the project structure and config files.

## Directory Structure

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
