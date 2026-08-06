export interface User {
  id: string;
  email: string;
  password: string;
}

// ข้อมูลผู้ใช้จำลอง
const users: User[] = [
  {
    id: '1',
    email: 'admin@gmail.com',
    password: '123456',
  },
];

export async function findUserByEmail(email: string) {
  return users.find((user) => user.email === email) ?? null;
}