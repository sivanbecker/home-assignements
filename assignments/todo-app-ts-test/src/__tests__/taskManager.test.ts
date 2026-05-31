import { TaskManager, TaskError } from '../index';

describe('TaskManager', () => {
  let manager: TaskManager;

  beforeEach(() => {
    manager = new TaskManager();
  });

  describe('addTask', () => {
    describe('happy path', () => {
      it('should return a task with the given title', () => {
        const task = manager.addTask('Buy milk');
        expect(task.title).toBe('Buy milk');
      });

      it('should assign a unique numeric id starting at 1', () => {
        const task = manager.addTask('First');
        expect(task.id).toBe(1);
      });

      it('should auto-increment ids for subsequent tasks', () => {
        const first = manager.addTask('First');
        const second = manager.addTask('Second');
        expect(second.id).toBe(first.id + 1);
      });

      it('should create the task with completed set to false', () => {
        const task = manager.addTask('Buy milk');
        expect(task.completed).toBe(false);
      });

      it('should set createdAt to a recent Date', () => {
        const before = new Date();
        const task = manager.addTask('Buy milk');
        const after = new Date();
        expect(task.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(task.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      });
    });

    describe('invalid input', () => {
      it('should throw TaskError when title is empty string', () => {
        expect(() => manager.addTask('')).toThrow(TaskError);
      });

      it('should throw TaskError when title is whitespace only', () => {
        expect(() => manager.addTask('   ')).toThrow(TaskError);
      });

      it('should include a descriptive message when throwing on blank title', () => {
        expect(() => manager.addTask('')).toThrow('title');
      });
    });

    describe('edge cases', () => {
      it('should trim leading and trailing whitespace from the title', () => {
        const task = manager.addTask('  Buy milk  ');
        expect(task.title).toBe('Buy milk');
      });

      it('should accept a title with a single non-whitespace character', () => {
        const task = manager.addTask('X');
        expect(task.title).toBe('X');
      });
    });
  });

  describe('completeTask', () => {
    describe('happy path', () => {
      it('should mark the task as completed', () => {
        const task = manager.addTask('Buy milk');
        const updated = manager.completeTask(task.id);
        expect(updated.completed).toBe(true);
      });

      it('should return the updated task', () => {
        const task = manager.addTask('Buy milk');
        const updated = manager.completeTask(task.id);
        expect(updated.id).toBe(task.id);
        expect(updated.title).toBe(task.title);
      });
    });

    describe('invalid input', () => {
      it('should throw TaskError when task id does not exist', () => {
        expect(() => manager.completeTask(999)).toThrow(TaskError);
      });

      it('should include a descriptive message when task is not found', () => {
        expect(() => manager.completeTask(999)).toThrow('999');
      });
    });

    describe('edge cases', () => {
      it('should be a no-op when task is already completed', () => {
        const task = manager.addTask('Buy milk');
        manager.completeTask(task.id);
        const updated = manager.completeTask(task.id);
        expect(updated.completed).toBe(true);
      });
    });
  });

  describe('deleteTask', () => {
    describe('happy path', () => {
      it('should remove the task from the list', () => {
        const task = manager.addTask('Buy milk');
        manager.deleteTask(task.id);
        expect(manager.listTasks()).toHaveLength(0);
      });

      it('should return void on success', () => {
        const task = manager.addTask('Buy milk');
        const result = manager.deleteTask(task.id);
        expect(result).toBeUndefined();
      });
    });

    describe('invalid input', () => {
      it('should throw TaskError when task id does not exist', () => {
        expect(() => manager.deleteTask(999)).toThrow(TaskError);
      });

      it('should include a descriptive message when task is not found', () => {
        expect(() => manager.deleteTask(999)).toThrow('999');
      });
    });

    describe('edge cases', () => {
      it('should not affect other tasks when one is deleted', () => {
        const first = manager.addTask('First');
        const second = manager.addTask('Second');
        manager.deleteTask(first.id);
        const remaining = manager.listTasks();
        expect(remaining).toHaveLength(1);
        expect(remaining[0]?.id).toBe(second.id);
      });
    });
  });

  describe('listTasks', () => {
    describe('happy path', () => {
      it('should return all tasks in insertion order', () => {
        manager.addTask('First');
        manager.addTask('Second');
        manager.addTask('Third');
        const tasks = manager.listTasks();
        expect(tasks.map(t => t.title)).toEqual(['First', 'Second', 'Third']);
      });

      it('should reflect completed state after completeTask', () => {
        const task = manager.addTask('Buy milk');
        manager.completeTask(task.id);
        const tasks = manager.listTasks();
        expect(tasks[0]?.completed).toBe(true);
      });
    });

    describe('edge cases (empty, boundary)', () => {
      it('should return an empty array when no tasks exist', () => {
        expect(manager.listTasks()).toEqual([]);
      });

      it('should return a new array each call (not a live reference)', () => {
        manager.addTask('First');
        const first = manager.listTasks();
        manager.addTask('Second');
        const second = manager.listTasks();
        expect(first).toHaveLength(1);
        expect(second).toHaveLength(2);
      });

      it('should not include a deleted task in the list', () => {
        const task = manager.addTask('Buy milk');
        manager.deleteTask(task.id);
        const tasks = manager.listTasks();
        expect(tasks.find(t => t.id === task.id)).toBeUndefined();
      });
    });
  });
});
