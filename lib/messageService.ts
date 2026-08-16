import { Prisma } from '@prisma/client';
import * as MessageModel from './messages';

export async function createMessage(data: { name: string; email: string; message: string }) {
  if (!data.name || !data.email || !data.message) {
    throw new Error('ข้อมูลไม่ครบ');
  }
  return await MessageModel.addMessage(data);
}

export async function listMessages() {
  return await MessageModel.getMessages();
}

// 1. เพิ่ม getMessageById
export async function getMessageById(id: string) {
  return await MessageModel.getMessageById(id);
}

// 2. เพิ่ม editMessage พร้อมจับ Error P2025
export async function editMessage(id: string, updates: object) {
  try {
    return await MessageModel.updateMessage(id, updates);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return null;
    }
    throw err;
  }
}

// 3. เพิ่ม removeMessage (สำหรับ DELETE) พร้อมจับ Error P2025
export async function removeMessage(id: string) {
  try {
    return await MessageModel.deleteMessage(id);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return null;
    }
    throw err;
  }
}