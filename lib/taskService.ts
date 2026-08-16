import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as TaskModel from './tasks';
import { NotFoundError, ValidationError } from './errors';

export async function createTask(data: {
  title: string;
  completed?: boolean;
}) {
  const title =
    typeof data.title === 'string'
      ? data.title.trim()
      : '';

  if (!title) {
    throw new ValidationError('ชื่องานห้ามเป็นค่าว่าง');
  }

  try {
    return await TaskModel.addTask({
      title,
      completed: data.completed ?? false,
    });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      throw new ValidationError('ชื่องานนี้มีอยู่แล้ว');
    }

    throw err;
  }
}

export async function listTasks() {
  return TaskModel.getTasks();
}

export async function findTaskById(id: string) {
  const task = await TaskModel.getTaskById(id);

  if (!task) {
    throw new NotFoundError('ไม่พบงานนี้');
  }

  return task;
}

export async function editTask(
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
    throw new ValidationError('ชื่องานห้ามเป็นค่าว่าง');
  }

  if (
    updates.completed !== undefined &&
    typeof updates.completed !== 'boolean'
  ) {
    throw new ValidationError(
      'completed ต้องเป็น true หรือ false'
    );
  }

  try {
    const payload: {
      title?: string;
      completed?: boolean;
    } = {};

    if (updates.title !== undefined) {
      payload.title = updates.title.trim();
    }

    if (updates.completed !== undefined) {
      payload.completed = updates.completed;
    }

    return await TaskModel.updateTask(id, payload);
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      throw new NotFoundError('ไม่พบงานนี้');
    }

    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      throw new ValidationError('ชื่องานนี้มีอยู่แล้ว');
    }

    throw err;
  }
}

export async function removeTask(id: string) {
  try {
    await TaskModel.deleteTask(id);

    return true;
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      throw new NotFoundError('ไม่พบงานนี้');
    }

    throw err;
  }
}