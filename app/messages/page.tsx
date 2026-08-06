async function getMessages() {
  const res = await fetch('http://localhost:3000/api/messages');

  if (!res.ok) {
    throw new Error('Failed to fetch messages');
  }

  return res.json();
}

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Messages
      </h1>

      {messages.map((item: any) => (
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