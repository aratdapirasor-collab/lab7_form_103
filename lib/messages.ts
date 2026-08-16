import { prisma } from './prisma';

export async function addMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  return await prisma.message.create({
    data,
  });
}

export async function getMessages() {
  return await prisma.message.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getMessageById(id: string) {
  return await prisma.message.findUnique({
    where: {
      id,
    },
  });
}

export async function updateMessage(
  id: string,
  updates: {
    message?: string;
    name?: string;
    email?: string;
  }
) {
  return await prisma.message.update({
    where: {
      id,
    },
    data: updates,
  });
}

export async function deleteMessage(id: string) {
  return await prisma.message.delete({
    where: {
      id,
    },
  });
}