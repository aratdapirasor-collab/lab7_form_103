import * as MessageModel from './messages';

export function createMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  if (!data.name || !data.email || !data.message) {
    throw new Error('ข้อมูลไม่ครบ');
  }

  return MessageModel.addMessage(data);
}

export function listMessages() {
  return MessageModel.getMessages();
}

export function getMessageById(id: string) {
  return (
    MessageModel.getMessages().find((m) => m.id === id) ?? null
  );
}

export function editMessage(
  id: string,
  updates: object
) {
  return MessageModel.updateMessage(id, updates);
}