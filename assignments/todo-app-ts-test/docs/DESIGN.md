# DESIGN

## Module Breakdown

| Module | Responsibility | Exports |
|---|---|---|
| `types.ts` | Task entity shape and error type | `Task`, `TaskError` |
| `taskManager.ts` | All CRUD operations on the task store | `TaskManager` class |
| `index.ts` | Public API re-export (and future CLI entry) | re-exports everything |

## Function / Class Signatures

### `types.ts`

```typescript
interface Task {
  readonly id: number;
  readonly title: string;
  completed: boolean;
  readonly createdAt: Date;
}

class TaskError extends Error {
  constructor(message: string)
}
```

### `taskManager.ts`

```typescript
class TaskManager {
  addTask(title: string): Task
  // Validates title (non-empty after trim), assigns next ID, sets completed=false and createdAt=now. Throws TaskError on blank title.

  completeTask(id: number): Task
  // Marks task as completed. No-op if already completed. Throws TaskError if task not found.

  deleteTask(id: number): void
  // Removes task by ID. Throws TaskError if task not found.

  listTasks(): Task[]
  // Returns all tasks in insertion order.
}
```

## Data Flow

1. Caller invokes a `TaskManager` method with an ID or title string
2. `TaskManager` validates input (title non-empty, or ID exists in the store)
3. On invalid input or missing ID, throws `TaskError` with a descriptive message
4. On success, mutates the internal `Map<number, Task>` and returns the result
5. `listTasks` converts the map values to an array in insertion order

## Implementation Checklist

- [ ] `Task` interface — **must-have**
- [ ] `TaskError` class — **must-have**
- [ ] `TaskManager.addTask` — **must-have**
- [ ] `TaskManager.completeTask` — **must-have**
- [ ] `TaskManager.deleteTask` — **must-have**
- [ ] `TaskManager.listTasks` — **must-have**
- [ ] `index.ts` re-exports — **must-have**
- [ ] README with setup + run instructions — **must-have**
