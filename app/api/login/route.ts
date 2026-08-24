// app/api/login/route.ts
import bcrypt from 'bcrypt';
import { findUserByEmail } from '@/lib/userService';

export async function POST(request: Request) {
  // 1. รับค่า email และ password จากหน้าเว็บ
  const { email, password } = await request.json();

  // 2. ค้นหา User จากอีเมลด้วย findUserByEmail
  const user = await findUserByEmail(email);

  // 3. เปรียบเทียบรหัสผ่านที่พิมพ์เข้ามา กับ Hash ใน DB ด้วย bcrypt.compare
  const isValid = user && (await bcrypt.compare(password, user.password));

  // ถ้าไม่ถูกต้อง ให้ส่ง Error 401 กลับไป
  if (!isValid) {
    return Response.json({ error: 'อีเมล/รหัสผ่านไม่ถูกต้อง' }, { status: 401 });
  }

  // 4. ถ้าถูกต้อง สร้าง Cookie Session และส่ง ok: true กลับไป
  const res = Response.json({ ok: true });
  res.headers.set('Set-Cookie', `session=${user.id}; Path=/; HttpOnly; Secure; SameSite=Strict`);
  return res;
}