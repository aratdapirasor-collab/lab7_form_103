import { createTask, listTasks } from '@/lib/taskService';
import { ValidationError } from '@/lib/errors';

export async function GET() {
  const tasks = await listTasks();
  return Response.json({ tasks });
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const saved = await createTask(body);
    return Response.json({ ok: true, item: saved }, { status: 201 });
  } catch (err) {
    const status = err instanceof ValidationError ? 400 : 500;
    return Response.json({ error: (err as Error).message }, { status });
  }
}
