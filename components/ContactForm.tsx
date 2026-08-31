
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (name.trim().length < 2) {
      setMessage("กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }

    if (content.trim().length < 5 || content.trim().length > 300) {
      setMessage("ข้อความต้องมี 5-300 ตัวอักษร");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message: content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "ส่งข้อความไม่สำเร็จ");
        return;
      }

      setMessage("ส่งข้อความสำเร็จ!");
      setName("");
      setEmail("");
      setContent("");
    } catch {
      setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl rounded-xl border bg-white p-6 shadow"
    >
      <div className="mb-4">
        <label className="mb-2 block font-medium">
          ชื่อ
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 outline-none"
          placeholder="กรอกชื่อของคุณ"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium">
          อีเมล
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 outline-none"
          placeholder="example@email.com"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium">
          ข้อความ
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full resize-y rounded-lg border px-4 py-2 outline-none"
          placeholder="กรอกข้อความที่ต้องการติดต่อ"
        />
      </div>

      {message && (
        <p className="mb-4 text-sm">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
      >
        ส่งข้อความ
      </button>
    </form>
  );
}
