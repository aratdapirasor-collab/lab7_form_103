import { prisma } from './prisma'; // หรือตาม path prisma ในโปรเจกต์ของคุณ
import { cleanRichText } from './sanitize';

export async function getMessages() {
  return await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMessageById(id: string) {
  return await prisma.message.findUnique({
    where: { id },
  });
}

export async function addMessage(data: { name: string; email: string; message: string; authorId?: string }) {
  // 🛡️ กรองแท็กอันตราย เช่น <script> ออกก่อนบันทึกลง Database (XSS Prevention)
  const safeMessage = cleanRichText(data.message);

  return await prisma.message.create({
    data: {
      name: data.name,
      email: data.email,
      message: safeMessage, // เซฟเฉพาะข้อความที่คลีนแล้ว
      authorId: data.authorId,
    },
  });
}

export async function updateMessage(id: string, data: { name?: string; email?: string; message?: string }) {
  const updateData: { name?: string; email?: string; message?: string } = { ...data };

  // ถ้ามีการแก้ข้อความ ให้คลีนข้อความก่อนด้วย
  if (data.message) {
    updateData.message = cleanRichText(data.message);
  }

  return await prisma.message.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteMessage(id: string) {
  return await prisma.message.delete({
    where: { id },
  });
}