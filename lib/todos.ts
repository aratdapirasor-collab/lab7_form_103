import { prisma } from './prisma';

export async function createTodo(data: {
  title: string;
  description?: string;
}) {
  return prisma.todo.create({
    data,
  });
}

export async function getTodos() {
  return prisma.todo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getTodoById(id: string) {
  return prisma.todo.findUnique({
    where: { id },
  });
}

export async function updateTodo(
  id: string,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
  }
) {
  return prisma.todo.update({
    where: { id },
    data,
  });
}

export async function deleteTodo(id: string) {
  return prisma.todo.delete({
    where: { id },
  });
}