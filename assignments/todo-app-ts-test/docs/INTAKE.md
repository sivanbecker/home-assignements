# INTAKE

## Functional Requirements

- Add a task with a title; assign it a unique ID and creation date automatically
- Mark a task as completed by ID
- Remove a task by ID
- List all current tasks (show ID, title, completion status, creation date)
- Prevent creating a task with an empty or whitespace-only title
- Return an error (or throw) when trying to update or delete a task that does not exist

## Constraints and Edge Cases

- Task IDs must be unique across the lifetime of the task store
- Title must be non-empty after trimming whitespace
- Completing an already-completed task: behavior unspecified — needs a decision
- Deleting a non-existent task: must be handled explicitly (not silently ignored)
- Updating a non-existent task: must be handled explicitly
- No persistence requirement stated — in-memory store is sufficient
- No concurrency requirement — synchronous operations only
- No sorting requirement stated for listing — insertion order is a safe default
