import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash รหัสผ่านก่อนเซฟ
  const hashedPassword = await bcrypt.hash('admin1234', 10);

  // สร้าง/อัปเดต Admin ด้วยอีเมล @tsu.ac.th
  await prisma.user.upsert({
    where: { email: 'admin@tsu.ac.th' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'admin@tsu.ac.th',
      password: hashedPassword,
    },
  });

  console.log('Admin account: admin@tsu.ac.th');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });