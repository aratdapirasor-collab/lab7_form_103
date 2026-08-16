import { NextResponse } from 'next/server';
import { getMessageById, editMessage, removeMessage } from '@/lib/messageService';

// GET: ดึงข้อมูลตาม ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const message = await getMessageById(resolvedParams.id);

    if (!message) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลข้อความ (ID ไม่ถูกต้อง)' },
        { status: 404 }
      );
    }

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}

// PATCH: แก้ไขข้อมูลตาม ID (จับ Error P2025 ตอบ 404)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    const updated = await editMessage(resolvedParams.id, body);

    if (!updated) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลข้อความที่ต้องการแก้ไข (ID ไม่ถูกต้อง)' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}

// DELETE: ลบข้อมูลตาม ID (จับ Error P2025 ตอบ 404)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const deleted = await removeMessage(resolvedParams.id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลข้อความที่ต้องการลบ (ID ไม่ถูกต้อง)' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'ลบข้อมูลสำเร็จ' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}