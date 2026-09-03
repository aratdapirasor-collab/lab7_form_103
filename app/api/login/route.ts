import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '@/lib/userService';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
    if (!email || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    // ค้นหา User จาก Prisma Database
    const user = await findUserByEmail(email);

    // ไม่พบ User
    if (!user) {
      return NextResponse.json(
        { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // ตรวจสอบรหัสผ่านกับ bcrypt
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    // รหัสผ่านไม่ถูกต้อง
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Login สำเร็จ
    const response = NextResponse.json(
      {
        message: 'เข้าสู่ระบบสำเร็จ',
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // สร้าง session cookie
    response.cookies.set('session', user.id, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}