import { findTaskById, editTask, removeTask } from '@/lib/taskService';
import { NotFoundError, ValidationError } from '@/lib/errors';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const task = await findTaskById(id);
    return Response.json(task);
  } catch (err) {
    const status = err instanceof NotFoundError ? 404 : 500;
    return Response.json({ error: (err as Error).message }, { status });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  try {
    const updated = await editTask(id, body);
    return Response.json(updated);
  } catch (err) {
    const status =
      err instanceof NotFoundError
        ? 404
        : err instanceof ValidationError
        ? 400
        : 500;
    return Response.json({ error: (err as Error).message }, { status });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await removeTask(id);
    return Response.json({ ok: true });
  } catch (err) {
    const status = err instanceof NotFoundError ? 404 : 500;
    return Response.json({ error: (err as Error).message }, { status });
  }
}
