export interface Task {
  readonly id: number;
  readonly title: string;
  completed: boolean;
  readonly createdAt: Date;
}

export class TaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskError';
  }
}
