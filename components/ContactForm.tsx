'use client';

import { useState } from 'react';

interface CommentFormProps {
  onCommentAdded?: () => void;
}

type FormStatus =
  | 'idle'
  | 'sending'
  | 'success'
  | 'error';

export default function CommentForm({
  onCommentAdded,
}: CommentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] =
    useState<FormStatus>('idle');

  // ตรวจสอบชื่อ
  const nameValid =
    name.trim().length >= 2;

  // ตรวจสอบอีเมล
  const emailValid =
    email.includes('@') &&
    email.includes('.') &&
    email.trim().length >= 5;

  // ตรวจสอบข้อความ
  const contentValid =
    content.trim().length >= 5 &&
    content.trim().length <= 300;

  // ตรวจสอบข้อมูลทั้งหมด
  const isValid =
    nameValid &&
    emailValid &&
    contentValid;

  // Validation
  function validate() {
    if (!nameValid) {
      return 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร';
    }

    if (!emailValid) {
      return 'กรุณากรอกอีเมลให้ถูกต้อง';
    }

    if (content.trim().length < 5) {
      return 'ความคิดเห็นต้องมีอย่างน้อย 5 ตัวอักษร';
    }

    if (content.trim().length > 300) {
      return 'ความคิดเห็นต้องไม่เกิน 300 ตัวอักษร';
    }

    return '';
  }

  // Reset สถานะเมื่อผู้ใช้แก้ไขข้อมูล
  function resetStatus() {
    setError('');
    setStatus('idle');
  }

  // ส่งข้อมูล
  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      setStatus('error');
      return;
    }

    setError('');
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        // ส่งเฉพาะข้อมูลที่ตรงกับ Prisma Message
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: content.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ?? 'ส่งความคิดเห็นไม่สำเร็จ'
        );
        setStatus('error');
        return;
      }

      // สำเร็จ
      setStatus('success');

      // ล้างฟอร์ม
      setName('');
      setEmail('');
      setContent('');

      // แจ้ง component แม่
      onCommentAdded?.();

    } catch (err) {
      console.error('POST /api/contact error:', err);

      setError(
        'ไม่สามารถเชื่อมต่อกับ Server ได้'
      );
      setStatus('error');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_22px_60px_-30px_rgba(37,99,235,0.45)] backdrop-blur-sm"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 px-6 py-6 text-white">
        <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-blue-50">
          📝 แบบฟอร์มภาษาไทย
        </div>

        <h2 className="mt-3 text-2xl font-semibold">
          ส่งข้อความถึงเรา
        </h2>

        <p className="mt-1 text-sm text-blue-100">
          กรุณากรอกข้อมูลให้ครบก่อนส่งข้อความ
          เพื่อให้เราตอบกลับคุณได้อย่างรวดเร็ว
        </p>
      </div>

      {/* Form */}
      <div className="space-y-5 p-6">

        {/* ชื่อ */}
        <div>
          <label
            htmlFor="comment-name"
            className="mb-2 block font-semibold text-slate-800"
          >
            ชื่อผู้แสดงความคิดเห็น
          </label>

          <input
            id="comment-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              resetStatus();
            }}
            placeholder="กรอกชื่อของคุณ"
            className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 outline-none transition focus:bg-white focus:ring-4 ${
              name.length > 0 && !nameValid
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />

          {name.length > 0 && !nameValid && (
            <p className="mt-1 text-sm text-red-600">
              ชื่อต้องมีอย่างน้อย 2 ตัวอักษร
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="comment-email"
            className="mb-2 block font-semibold text-slate-800"
          >
            อีเมล
          </label>

          <input
            id="comment-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              resetStatus();
            }}
            placeholder="example@email.com"
            className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 outline-none transition focus:bg-white focus:ring-4 ${
              email.length > 0 && !emailValid
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />

          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              อีเมลใช้สำหรับระบุผู้แสดงความคิดเห็น
            </p>

            {email.length > 0 && (
              <span
                className={`text-sm font-medium ${
                  emailValid
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {emailValid
                  ? 'อีเมลถูกต้อง'
                  : 'อีเมลไม่ถูกต้อง'}
              </span>
            )}
          </div>
        </div>

        {/* ข้อความ */}
        <div>
          <label
            htmlFor="comment-content"
            className="mb-2 block font-semibold text-slate-800"
          >
            ความคิดเห็น
          </label>

          <textarea
            id="comment-content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              resetStatus();
            }}
            placeholder="เขียนความคิดเห็นเกี่ยวกับโพสต์นี้"
            rows={6}
            maxLength={300}
            className={`w-full resize-y rounded-2xl border bg-slate-50 px-4 py-3 outline-none transition focus:bg-white focus:ring-4 ${
              content.length > 0 && !contentValid
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />

          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              อย่างน้อย 5 ตัวอักษร
            </p>

            <p
              className={`text-sm ${
                content.length >= 280
                  ? 'font-semibold text-orange-600'
                  : 'text-slate-500'
              }`}
            >
              {content.length}/300 ตัวอักษร
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
          >
            {error}
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            ส่งข้อความสำเร็จแล้ว ขอบคุณที่ติดต่อเรา
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={
            !isValid ||
            status === 'sending'
          }
          className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition ${
            isValid && status !== 'sending'
              ? 'bg-blue-600 shadow-md hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg'
              : 'cursor-not-allowed bg-slate-300'
          }`}
        >
          {status === 'sending'
            ? 'กำลังส่งความคิดเห็น...'
            : 'ส่งความคิดเห็น'}
        </button>
      </div>
    </form>
  );
}