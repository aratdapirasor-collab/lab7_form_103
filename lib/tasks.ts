import { prisma } from './prisma';

export async function addTask(data: {
  title: string;
  completed?: boolean;
}) {
  return prisma.task.create({
    data: {
      id: crypto.randomUUID(),
      title: data.title,
      completed: data.completed ?? false,
    },
  });
}

export async function getTasks() {
  return prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
  });
}

export async function updateTask(
  id: string,
  updates: {
    title?: string;
    completed?: boolean;
  }
) {
  return prisma.task.update({
    where: { id },
    data: updates,
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}