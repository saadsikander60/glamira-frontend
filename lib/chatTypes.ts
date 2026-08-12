export type ChatSender = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

export type ChatAttachment = {
  url?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
};

export type ChatMessage = {
  _id: string;
  conversation: string;
  sender: ChatSender | string;
  senderRole: "USER" | "ADMIN";
  text: string;
  messageType: "TEXT" | "IMAGE" | "FILE";
  attachment?: ChatAttachment;
  deliveredAt?: string | null;
  seenAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ChatConversation = {
  _id: string;
  user: ChatSender | string;
  lastMessage?: string;
  lastMessageAt?: string;
  lastMessageSender?: ChatSender | string;
  unreadForUser?: number;
  unreadForAdmin?: number;
  createdAt?: string;
  updatedAt?: string;
};

export function getSenderId(sender: ChatSender | string | undefined) {
  if (!sender) return "";
  if (typeof sender === "string") return sender;
  return sender._id || sender.id || "";
}

export function formatChatTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatChatDayLabel(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
