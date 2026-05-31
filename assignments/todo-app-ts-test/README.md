# Todo App (TypeScript)

A small TypeScript CLI for managing a task list. Supports adding, completing, deleting, and listing tasks with strong typing and in-memory storage.

## Requirements

- Node.js 18+
- npm 9+

## Setup

```bash
npm install
```

## Running Tests

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Type Checking

```bash
npm run typecheck
```

## Linting

```bash
npm run lint
```

## Build

```bash
npm run build
```

Compiled output lands in `dist/`.

## Usage (as a module)

```typescript
import { TaskManager, TaskError } from './src';

const manager = new TaskManager();

// Add a task
const task = manager.addTask('Buy milk');
console.log(task); // { id: 1, title: 'Buy milk', completed: false, createdAt: Date }

// List all tasks
manager.listTasks();

// Complete a task
manager.completeTask(task.id);

// Delete a task
manager.deleteTask(task.id);
```

## Error Handling

All operations that fail throw a `TaskError`:

```typescript
try {
  manager.completeTask(999);
} catch (e) {
  if (e instanceof TaskError) {
    console.error(e.message); // "Task with id 999 not found"
  }
}
```

Invalid titles (empty or whitespace-only) also throw `TaskError`.

## Project Structure

```
src/
├── types.ts          # Task interface and TaskError
├── taskManager.ts    # CRUD logic
├── index.ts          # Public API re-export
└── __tests__/
    └── taskManager.test.ts
```
