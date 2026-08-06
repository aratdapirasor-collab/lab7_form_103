// lib/comments.ts

// 1. กำหนดโครงสร้างข้อมูลให้ตรงกับที่ใช้จริงใน API
export interface Comment {
  id: string;
  postId: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

// 2. อาร์เรย์สำหรับเก็บข้อมูลคอมเมนต์จำลอง
let comments: Comment[] = [];

// 3. ฟังก์ชันดึงคอมเมนต์ทั้งหมด
export function getComments() {
  return comments;
}

// 4. ฟังก์ชันดึงคอมเมนต์เฉพาะของโพสต์นั้นๆ (แก้ตัวแดง getCommentsByPostId)
export function getCommentsByPostId(postId: string) {
  return comments.filter((comment) => comment.postId === postId);
}

// 5. ฟังก์ชันเพิ่มคอมเมนต์ใหม่ (แก้ตัวแดง addComment)
export function addComment(data: {
  postId: string;
  name: string;
  email: string;
  content: string;
}) {
  const newComment: Comment = {
    id: Date.now().toString(), // สุ่มไอดีจากเวลา
    postId: data.postId,
    name: data.name,
    email: data.email,
    content: data.content,
    createdAt: new Date().toISOString(),
  };
  
  comments.push(newComment);
  return newComment;
}
