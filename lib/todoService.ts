import { Prisma } from '@prisma/client';
import * as TodoModel from './todos';

export async function createTodo(data: {
  title: string;
  description?: string;
}) {
  if (!data.title) {
    throw new Error('กรุณาระบุชื่อรายการ');
  }

  try {
    return await TodoModel.createTodo(data);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      throw new Error('ชื่อนี้มีอยู่แล้ว');
    }
    throw err;
  }
}

export async function listTodos() {
  return TodoModel.getTodos();
}

export async function getTodo(id: string) {
  return TodoModel.getTodoById(id);
}

export async function editTodo(
  id: string,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
  }
) {
  try {
    return await TodoModel.updateTodo(id, data);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return null;
    }
    throw err;
  }
}

export async function removeTodo(id: string) {
  try {
    return await TodoModel.deleteTodo(id);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return null;
    }
    throw err;
  }
}