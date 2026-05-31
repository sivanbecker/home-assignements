import { TaskManager, TaskError } from './index';

const manager = new TaskManager();

console.log('=== Adding tasks ===');
const t1 = manager.addTask('Buy milk');
const t2 = manager.addTask('Write tests');
const t3 = manager.addTask('Review PR');
console.log(manager.listTasks());

console.log('\n=== Completing task 1 ===');
manager.completeTask(t1.id);
console.log(manager.listTasks());

console.log('\n=== Deleting task 2 ===');
manager.deleteTask(t2.id);
console.log(manager.listTasks());

console.log('\n=== Error: task not found ===');
try {
  manager.completeTask(999);
} catch (e) {
  if (e instanceof TaskError) console.log('TaskError:', e.message);
}

console.log('\n=== Error: empty title ===');
try {
  manager.addTask('   ');
} catch (e) {
  if (e instanceof TaskError) console.log('TaskError:', e.message);
}
