export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const tasks: Task[] = [];

export function addTask(
  data: Omit<Task, 'id' | 'createdAt'>
) {
  const task: Task = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  };

  tasks.push(task);

  return task;
}

export function getTasks() {
  return tasks;
}

export function getTaskById(id: string) {
  return tasks.find((task) => task.id === id) ?? null;
}

export function updateTask(
  id: string,
  updates: Partial<Task>
) {
  const index = tasks.findIndex(
    (task) => task.id === id
  );

  if (index === -1) {
    return null;
  }

  tasks[index] = {
    ...tasks[index],
    ...updates,
  };

  return tasks[index];
}

export function deleteTask(id: string) {
  const index = tasks.findIndex(
    (task) => task.id === id
  );

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);

  return true;
}