import { getMessageById, editMessage, removeMessage } from '@/lib/messageService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const message = await getMessageById(id);
  if (!message) {
    return Response.json({ error: 'ไม่พบข้อความ' }, { status: 404 });
  }
  return Response.json(message);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  try {
    const updated = await editMessage(id, body);
    if (!updated) {
      return Response.json({ error: 'ไม่พบข้อความ' }, { status: 404 });
    }
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const deleted = await removeMessage(id);
    if (!deleted) {
      return Response.json({ error: 'ไม่พบข้อความ' }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }
}
