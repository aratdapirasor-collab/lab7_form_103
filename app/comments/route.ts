import { getComments, addComment } from '@/lib/comments';

export async function GET() {
  return Response.json(getComments());
}

export async function POST(request: Request) {
  const body = await request.json();
  const newComment = addComment(body);
  return Response.json(newComment, { status: 201 });
}
