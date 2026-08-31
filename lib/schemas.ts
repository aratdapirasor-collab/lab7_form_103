// lib/schemas.ts
import { z } from 'zod';

// ==========================================
// 1. Message Schema (สำหรับ Lab 4 / Contact Form)
// ==========================================
export const messageSchema = z.object({
  name: z.string().min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร').max(100, 'ชื่อยาวเกินไป'),
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  message: z.string().min(5, 'ข้อความต้องมีอย่างน้อย 5 ตัวอักษร').max(1000, 'ข้อความยาวเกินไป'),
  tag: z.string().optional(),
});

export type MessageInput = z.infer<typeof messageSchema>;

// ==========================================
// 2. Change Password Schema (สำหรับ Workshop Task 4.1)
// ==========================================
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'กรุณากรอกรหัสผ่านเดิม'),
  newPassword: z.string().min(8, 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;