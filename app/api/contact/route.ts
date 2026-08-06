import { createMessage, listMessages } from '@/lib/messageService';
export async function GET() {
 return Response.json({ messages: listMessages() });
}
export async function POST(request: Request) {
 const body = await request.json();
 try {
 const saved = createMessage(body);
 return Response.json({ ok: true, item: saved }, { status: 201 });
 } catch (err) {
 return Response.json({ error: (err as Error).message }, { status: 400 });
 }
}