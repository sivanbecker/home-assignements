import { Task, TaskError } from './types';

export class TaskManager {
  private readonly tasks: Map<number, Task> = new Map();
  private nextId = 1;

  addTask(title: string): Task {
    const trimmed = title.trim();
    if (trimmed.length === 0) {
      throw new TaskError('Task title must not be empty');
    }
    const task: Task = {
      id: this.nextId++,
      title: trimmed,
      completed: false,
      createdAt: new Date(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  completeTask(id: number): Task {
    const task = this.tasks.get(id);
    if (task === undefined) {
      throw new TaskError(`Task with id ${id} not found`);
    }
    task.completed = true;
    return task;
  }

  deleteTask(id: number): void {
    if (!this.tasks.has(id)) {
      throw new TaskError(`Task with id ${id} not found`);
    }
    this.tasks.delete(id);
  }

  listTasks(): Task[] {
    return Array.from(this.tasks.values());
  }
}
