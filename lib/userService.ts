import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { changePasswordSchema } from './schemas';
import { ValidationError, NotFoundError } from './errors';
import { ZodError } from 'zod';

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

export async function changeUserPassword(
  userId: string,
  rawInput: unknown
) {
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

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFoundError(
      'ไม่พบข้อมูลผู้ใช้งาน หรือเซสชันไม่ถูกต้อง'
    );
  }

  const isOldPasswordValid = await bcrypt.compare(
    oldPassword,
    user.password
  );

  if (!isOldPasswordValid) {
    throw new ValidationError('รหัสผ่านเดิมไม่ถูกต้อง');
  }

  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedNewPassword,
    },
  });

  return {
    success: true,
  };
}