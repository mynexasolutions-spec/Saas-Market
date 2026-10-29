export type UserPresence = "online" | "idle" | "offline";

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  role: "admin" | "vendor" | "buyer";
  title?: string;
  company?: string;
  presence: UserPresence;
  customStatus?: string;
  lastSeen?: string;
  bio?: string;
  website?: string;
}

export interface ChatReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole: "admin" | "vendor" | "buyer";
  senderTitle?: string;
  content: string;
  timestamp: string; // ISO string
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: "image" | "file";
  reactions: ChatReaction[];
  replyToId?: string;
  replyToText?: string;
  replyToUser?: string;
  isPinned?: boolean;
}

export interface ChatRoom {
  id: string;
  type: "channel" | "dm";
  name: string;
  topic?: string;
  description?: string;
  avatar?: string;
  isPrivate?: boolean;
  membersCount?: number;
  recipient?: ChatUser; // For DMs
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: string;
    senderName: string;
  };
}

export type ChatRealtimeEvent =
  | { type: "NEW_MESSAGE"; message: ChatMessage }
  | { type: "MESSAGE_REACTION"; messageId: string; roomId: string; reactions: ChatReaction[] }
  | { type: "PIN_MESSAGE"; messageId: string; roomId: string; isPinned: boolean }
  | { type: "DELETE_MESSAGE"; messageId: string; roomId: string }
  | { type: "USER_PRESENCE"; userId: string; presence: UserPresence; lastSeen: string }
  | { type: "TYPING_START"; roomId: string; user: { id: string; name: string } }
  | { type: "TYPING_STOP"; roomId: string; userId: string }
  | { type: "ROOM_UPDATED"; room: ChatRoom };

