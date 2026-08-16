import { listMessages } from '@/lib/messageService';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const messages = await listMessages();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Messages
      </h1>

      {messages.map((item: { id: string; name: string; email: string; message: string }) => (
        <div
          key={item.id}
          className="border p-4 mb-3 rounded"
        >
          <p>
            <b>Name:</b> {item.name}
          </p>

          <p>
            <b>Email:</b> {item.email}
          </p>

          <p>
            <b>Message:</b> {item.message}
          </p>
        </div>
      ))}
    </main>
  );
}