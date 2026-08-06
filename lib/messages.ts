export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
}

let messages: ContactMessage[] = [];

export function addMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  const newMessage: ContactMessage = {
    id: Date.now().toString(),
    ...data,
  };

  messages.push(newMessage);

  return newMessage;
}

export function getMessages() {
  return messages;
}

export function updateMessage(
  id: string,
  updates: Partial<ContactMessage>
) {
  const index = messages.findIndex((m) => m.id === id);

  if (index === -1) return null;

  messages[index] = {
    ...messages[index],
    ...updates,
  };

  return messages[index];
}