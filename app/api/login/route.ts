
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '@/lib/userService';

export async function POST(request: Request) {
  try {
    // 1. รับค่า email และ password จากหน้าเว็บ
    const { email, password } = await request.json();

    // 2. ค้นหา User จากอีเมลด้วย findUserByEmail
    const user = await findUserByEmail(email);

    // 3. เปรียบเทียบรหัสผ่านกับ Hash ในฐานข้อมูล
    const isValid =
      user && (await bcrypt.compare(password, user.password));

    // ถ้าอีเมลหรือรหัสผ่านไม่ถูกต้อง
    if (!isValid) {
      return NextResponse.json(
        { error: 'อีเมล/รหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // 4. ถ้าถูกต้อง สร้าง Cookie Session
    const response = NextResponse.json({ ok: true });

    response.cookies.set('session', user.id, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);

    return NextResponse.json(
      {
        error: err?.message || 'Server error',
        details: String(err),
      },
      { status: 500 }
    );
  }
}
