import { createMessage, listMessages } from '@/lib/messageService';
import { messageSchema } from '@/lib/schemas'; // 1. import schema เข้ามา

export async function GET() {
  const messages = await listMessages();
  return Response.json({ messages });
}

export async function POST(request: Request) {
  const body = await request.json();

  // 2. ตรวจสอบข้อมูลด้วย Zod
  const parsed = messageSchema.safeParse(body);

  // 3. ถ้าข้อมูลไม่ถูกต้อง ให้ส่ง Error 400 กลับไปพร้อมแจ้งรายละเอียด
  if (!parsed.success) {
    return Response.json(
      { 
        ok: false, 
        error: 'ข้อมูลไม่ถูกต้อง', 
        details: parsed.error.flatten().fieldErrors 
      }, 
      { status: 400 }
    );
  }

  try {
    // 4. ส่งข้อมูลที่ผ่านการตรวจแล้ว (parsed.data) ไปสร้าง Message
    const saved = await createMessage(parsed.data);
    return Response.json({ ok: true, item: saved }, { status: 201 });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }
}