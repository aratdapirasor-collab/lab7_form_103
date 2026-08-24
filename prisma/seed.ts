import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash รหัสผ่านก่อนเซฟ
  const hashedPassword = await bcrypt.hash('123456', 10);

  // อัปเดตรหัสผ่านของ admin@gmail.com ให้เป็น Hash
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: { password: hashedPassword },
    create: { email: 'admin@gmail.com', password: hashedPassword },
  });

  // ถ้าต้องการเพิ่ม admin@tsu.ac.th ตามโจทย์ด้วย
  const hashedTsu = await bcrypt.hash('1234', 10);
  await prisma.user.upsert({
    where: { email: 'admin@tsu.ac.th' },
    update: { password: hashedTsu },
    create: { email: 'admin@tsu.ac.th', password: hashedTsu },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());