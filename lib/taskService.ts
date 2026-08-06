import * as TaskModel from './tasks';

import {
  NotFoundError,
  ValidationError,
} from './errors';

export function createTask(data: {
  title: string;
  completed?: boolean;
}) {
  const title =
    typeof data.title === 'string'
      ? data.title.trim()
      : '';

  if (!title) {
    throw new ValidationError(
      'ชื่องานห้ามเป็นค่าว่าง'
    );
  }

  return TaskModel.addTask({
    title,
    completed: data.completed ?? false,
  });
}

export function listTasks() {
  return TaskModel.getTasks();
}

export function findTaskById(id: string) {
  const task = TaskModel.getTaskById(id);

  if (!task) {
    throw new NotFoundError('ไม่พบงานนี้');
  }

  return task;
}

export function editTask(
  id: string,
  updates: Partial<{
    title: string;
    completed: boolean;
  }>
) {
  if (
    updates.title !== undefined &&
    updates.title.trim() === ''
  ) {
    throw new ValidationError(
      'ชื่องานห้ามเป็นค่าว่าง'
    );
  }

  if (
    updates.completed !== undefined &&
    typeof updates.completed !== 'boolean'
  ) {
    throw new ValidationError(
      'completed ต้องเป็น true หรือ false'
    );
  }

  const updated = TaskModel.updateTask(
    id,
    updates
  );

  if (!updated) {
    throw new NotFoundError('ไม่พบงานนี้');
  }

  return updated;
}

export function removeTask(id: string) {
  const deleted = TaskModel.deleteTask(id);

  if (!deleted) {
    throw new NotFoundError('ไม่พบงานนี้');
  }

  return true;
}