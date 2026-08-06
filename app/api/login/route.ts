import { findUserByEmail } from '@/lib/users';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await findUserByEmail(email);

  if (!user || user.password !== password) {
    return Response.json(
      {
        error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      },
      {
        status: 401,
      }
    );
  }

  const response = Response.json({
    ok: true,
  });

  response.headers.set(
    'Set-Cookie',
    `session=${user.id}; Path=/; HttpOnly`
  );

  return response;
}