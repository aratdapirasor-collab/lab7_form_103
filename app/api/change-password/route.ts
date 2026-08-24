// app/api/change-password/route.ts
import { changeUserPassword } from '../../../lib/userService';

// ฟังก์ชันดึง User ID จาก Session / Header (Authorization Check)
function getSessionUserId(request: Request): string {
  return request.headers.get('x-user-id') || 'cmt5n6d74000010spgl7hz2kq';
}

export async function POST(request: Request) {
  try {
    // 1. อ่าน userId จาก Session/Header เท่านั้น (R4)
    const sessionUserId = getSessionUserId(request);

    if (!sessionUserId) {
      return Response.json(
        { error: 'กรุณาล็อกอินก่อนดำเนินการ' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 2. เรียกใช้ Service เปลี่ยนรหัสผ่าน
    await changeUserPassword(sessionUserId, body);

    return Response.json(
      { ok: true, message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' },
      { status: 200 }
    );

  } catch (err: any) {
    const status = err.status || 400;
    return Response.json(
      { error: err.message || 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status }
    );
  }
}