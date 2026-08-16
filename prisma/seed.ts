import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ล้างข้อมูลเก่าก่อนเพื่อป้องกัน ID/Email ซ้ำ
  await prisma.message.deleteMany();

  // สร้างข้อมูลเริ่มต้น 3 รายการ
  await prisma.message.createMany({
    data: [
      {
        name: 'Somchai Jaidee',
        email: 'somchai@example.com',
        message: 'สอบถามข้อมูลเกี่ยวกับระบบเพิ่มเติมครับ',
      },
      {
        name: 'Somsri Rakdee',
        email: 'somsri@example.com',
        message: 'ต้องการติดต่อสอบถามเรื่องการลงทะเบียน',
      },
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'Hello, I would like to inquire about the service.',
      },
    ],
  });

  console.log('🌱 Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });