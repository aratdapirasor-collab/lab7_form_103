// app/api/messages/[id]/route.ts
import { editMessage, removeMessage } from '@/lib/messageService';

// ฟังก์ชันดึง User ID จาก Session / Cookie
function getSessionUserId(request: Request): string {
  return request.headers.get('x-user-id') || 'user-1';
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUserId = getSessionUserId(request);
    const updates = await request.json();

    // ส่งครบ 3 arguments: (id, updates, sessionUserId)
    const updated = await editMessage(id, updates, sessionUserId);
    return Response.json({ ok: true, item: updated });
  } catch (err: any) {
    const status = err.status || 400;
    return Response.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUserId = getSessionUserId(request);

    // ส่งครบ 2 arguments: (id, sessionUserId)
    await removeMessage(id, sessionUserId);
    return Response.json({ ok: true });
  } catch (err: any) {
    const status = err.status || 400;
    return Response.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status });
  }
}