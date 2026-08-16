import { createMessage, listMessages } from '@/lib/messageService';

export async function GET() {
  const messages = await listMessages();
  return Response.json({ messages });
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const saved = await createMessage(body);
    return Response.json({ ok: true, item: saved }, { status: 201 });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }
}
