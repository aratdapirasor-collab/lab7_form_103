// lib/messageService.ts

import { ValidationError, NotFoundError } from './errors';

// 1. กำหนดโครงสร้างข้อมูลของ Message
export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

// 2. อาร์เรย์จำลองสำหรับเก็บข้อมูลในหน่วยความจำ (Memory)
let messages: Message[] = [];

// 3. ฟังก์ชันดึงข้อความทั้งหมด
export function listMessages(): Message[] {
  return messages;
}

// 4. ฟังก์ชันดึงข้อความตาม ID (แก้ตัวแดง getMessageById)
export function getMessageById(id: string): Message {
  const message = messages.find((item) => item.id === id);
  if (!message) {
    throw new NotFoundError('ไม่พบข้อความที่ระบุ');
  }
  return message;
}

// 5. ฟังก์ชันบันทึกข้อความใหม่พร้อม Validation
export function createMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  if (!data.name) {
    throw new ValidationError('กรุณากรอกชื่อของคุณ');
  }
  if (!data.email || !data.email.includes('@')) {
    throw new ValidationError('รูปแบบอีเมลไม่ถูกต้อง');
  }
  if (!data.message) {
    throw new ValidationError('กรุณากรอกข้อความ');
  }

  const newMessage: Message = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    message: data.message,
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);
  return newMessage;
}

// 6. ฟังก์ชันแก้ไขข้อความ (แก้ตัวแดง editMessage)
export function editMessage(id: string, updates: Partial<{ name: string; email: string; message: string }>): Message {
  const messageIndex = messages.findIndex((item) => item.id === id);
  
  if (messageIndex === -1) {
    throw new NotFoundError('ไม่พบข้อความที่ต้องการแก้ไข');
  }

  // อัปเดตข้อมูลเฉพาะฟิลด์ที่ส่งมา
  messages[messageIndex] = {
    ...messages[messageIndex],
    ...updates,
  };

  return messages[messageIndex];
}

// 7. ฟังก์ชันลบข้อความ (แก้ตัวแดง removeMessage)
export function removeMessage(id: string): boolean {
  const index = messages.findIndex((item) => item.id === id);
  
  if (index === -1) {
    throw new NotFoundError('ไม่พบข้อความที่ต้องการลบ');
  }
  
  messages.splice(index, 1);
  return true;
}
