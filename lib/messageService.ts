// lib/messageService.ts
import { prisma } from './prisma';
import { cleanRichText } from './sanitize';
import { messageSchema } from './schemas';
import { ZodError } from 'zod';
import { ValidationError, ForbiddenError, NotFoundError } from './errors';

// 1. ดึงรายการข้อความทั้งหมด (listMessages)
// B VERSION: force conflict

export async function listMessages(search?: string) {
  const all = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
  });
  if (!search) return all;
  return all.filter(
    (m) => m.name.includes(search) || m.message.includes(search)
  );
}

// 2. ดึงข้อความตาม ID (getMessageById)
export async function getMessageById(id: string) {
  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new NotFoundError('ไม่พบข้อความนี้');
  return message;
}

// 3. สร้างข้อความใหม่ (createMessage - ใช้ Zod + Sanitize)
export async function createMessage(raw: unknown) {
  let data;
  try {
    data = messageSchema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(err.issues[0].message);
    }
    throw err;
  }

  const safeMessage = cleanRichText(data.message);

  return await prisma.message.create({
    data: {
      name: data.name,
      email: data.email,
      message: safeMessage,
      tag: data.tag,
    },
  });
}

// 4. แก้ไขข้อความ (editMessage - มี Authorization Check)
export async function editMessage(id: string, updates: unknown, sessionUserId: string) {
  const message = await getMessageById(id);

  if (message.authorId && message.authorId !== sessionUserId) {
    throw new ForbiddenError('คุณไม่มีสิทธิ์แก้ไขข้อความนี้');
  }

  let validData;
  try {
    validData = messageSchema.partial().parse(updates);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(err.issues[0].message);
    }
    throw err;
  }

  if (validData.message) {
    validData.message = cleanRichText(validData.message);
  }

  return await prisma.message.update({
    where: { id },
    data: validData,
  });
}

// 5. ลบข้อความ (removeMessage - มี Authorization Check)
export async function removeMessage(id: string, sessionUserId: string) {
  const message = await getMessageById(id);

  if (message.authorId && message.authorId !== sessionUserId) {
    throw new ForbiddenError('คุณไม่มีสิทธิ์ลบข้อความนี้');
  }

  return await prisma.message.delete({
    where: { id },
  });
}