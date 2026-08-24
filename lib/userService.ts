// lib/userService.ts
import bcrypt from 'bcrypt';
import { prisma } from './prisma';
import { changePasswordSchema } from './schemas';
import { ValidationError, NotFoundError } from './errors';
import { ZodError } from 'zod';

export async function changeUserPassword(userId: string, rawInput: unknown) {
  // 1. Validation ข้อมูลด้วย Zod (R4)
  let validatedInput;
  try {
    validatedInput = changePasswordSchema.parse(rawInput);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(err.issues[0].message);
    }
    throw err;
  }

  const { oldPassword, newPassword } = validatedInput;

  // 2. ดึงข้อมูล User จาก DB ผ่าน Prisma (R2: ป้องกัน SQL Injection)
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('ไม่พบข้อมูลผู้ใช้งาน หรือเซสชันไม่ถูกต้อง');
  }

  // 3. ตรวจสอบรหัสผ่านเดิมด้วย bcrypt (R1)
  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) {
    throw new ValidationError('รหัสผ่านเดิมไม่ถูกต้อง');
  }

  // 4. เข้ารหัสรหัสผ่านใหม่ด้วย bcrypt (Cost factor = 10) (R1)
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // 5. บันทึกรหัสผ่านใหม่ลงฐานข้อมูล
  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedNewPassword,
    },
  });

  return { success: true };
}
// 3. ตรวจสอบรหัสผ่านเดิมด้วย bcrypt (R1)
  // const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  // if (!isOldPasswordValid) {
  //   throw new ValidationError('รหัสผ่านเดิมไม่ถูกต้อง');
  // }