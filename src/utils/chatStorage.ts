import { ChatMessage, ChatRoom, ChatUser, ChatRealtimeEvent, UserPresence } from "@/types/chat";

export const CHAT_STORAGE_MESSAGES_KEY = "saas_mrkt_chat_messages_v1";
export const CHAT_STORAGE_ROOMS_KEY = "saas_mrkt_chat_rooms_v1";
export const CHAT_STORAGE_PRESENCE_KEY = "saas_mrkt_chat_presence_v1";
export const CHAT_CHANNEL_NAME = "saas_mrkt_chat_v1";
export const CHAT_EVENT_NAME = "saas_mrkt_chat_event";

// BroadcastChannel instance for real-time multi-tab cross-communication
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHAT_CHANNEL_NAME);
  } catch (err) {
    console.warn("BroadcastChannel not supported or disabled:", err);
  }
}

export function broadcastChatEvent(event: ChatRealtimeEvent) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(event);
    } catch {}
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHAT_EVENT_NAME, { detail: event }));
  }
}

export const COMMUNITY_MEMBERS: ChatUser[] = [
  {
    id: "user-concierge",
    name: "SaaS MRKT Concierge",
    email: "support@saasmrkt.com",
    initials: "SM",
    role: "admin",
    title: "Official Platform Admin & Concierge",
    company: "SaaS MRKT Official",
    presence: "online",
    customStatus: "Assisting buyers & sellers 24/7",
    bio: "Official verified platform administrator. Reach out for dispute resolution, enterprise escrow, or vendor onboarding.",
  },
  {
    id: "user-david-miller",
    name: "David Miller",
    email: "david.miller@growthflow.io",
    initials: "DM",
    role: "vendor",
    title: "Lead Architect & Co-Founder",
    company: "GrowthFlow AI",
    presence: "online",
    customStatus: "Deploying Edge AI v2.4",
    bio: "Co-Founder & Lead Architect at GrowthFlow AI. Building automated CRM and outbound revenue pipelines for SaaS companies.",
    website: "https://growthflow.io",
  },
  {
    id: "user-sarah-chen",
    name: "Sarah Chen",
    email: "partnerships@manage360.io",
    initials: "SC",
    role: "vendor",
    title: "VP Partnerships",
    company: "Manage360 Suite",
    presence: "online",
    customStatus: "Reviewing Enterprise RFPs",
    bio: "VP of Strategic Partnerships at Manage360. Helping scale project management workflows and sprint burndown tracking.",
    website: "https://manage360.io",
  },
  {
    id: "user-elena-rostova",
    name: "Elena Rostova",
    email: "elena@taskflow.dev",
    initials: "ER",
    role: "vendor",
    title: "Account Director",
    company: "TaskFlow Workspace",
    presence: "idle",
    customStatus: "In client meeting until 5 PM",
    bio: "Account Director at TaskFlow. Specialized in SOC-2 compliant high-velocity workspace tooling.",
    website: "https://taskflow.dev",
  },
  {
    id: "user-alex-morgan",
    name: "Alex Morgan",
    email: "alex@company.com",
    initials: "AM",
    role: "buyer",
    title: "Head of Product & Growth",
    company: "Acme Cloud Ventures",
    presence: "online",
    customStatus: "Auditing Q4 SaaS spend",
    bio: "Procurement Lead evaluating B2B cloud infrastructure, observability tooling, and collaborative software.",
  },
  {
    id: "user-priya-sharma",
    name: "Priya Sharma",
    email: "priya@cloudnova.tech",
    initials: "PS",
    role: "buyer",
    title: "Director of Engineering",
    company: "CloudNova Technologies",
    presence: "online",
    customStatus: "Migrating Kubernetes clusters",
    bio: "Leading distributed platform engineering. Passionate about developer productivity and serverless platforms.",
  },
  {
    id: "user-michael-vance",
    name: "Michael Vance",
    email: "mvance@fintechcapital.io",
    initials: "MV",
    role: "buyer",
    title: "VP Technology Operations",
    company: "FinTech Capital Global",
    presence: "idle",
    customStatus: "Reviewing SOC 2 compliance reports",
    bio: "Overseeing security audits, data governance, and fintech enterprise tool compliance.",
  },
  {
    id: "user-james-thorne",
    name: "James Thorne",
    email: "james.t@secopsdefense.com",
    initials: "JT",
    role: "buyer",
    title: "Principal Security Architect",
    company: "SecOps Defense",
    presence: "offline",
    lastSeen: "2 hours ago",
    bio: "Zero Trust architecture, Okta SSO evaluation, and enterprise access reviews.",
  },
];

export const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  {
    id: "channel-general",
    type: "channel",
    name: "general-saas",
    topic: "General discussions, tool recommendations, and software architecture",
    description: "The main town square for SaaS buyers, founders, and tech enthusiasts on SaaS MRKT.",
    unreadCount: 0,
    membersCount: 428,
  },
  {
    id: "channel-deals",
    type: "channel",
    name: "lifetime-deals",
    topic: "Exclusive founder discounts, promo codes, and group-buying offers",
    description: "Track verified seasonal promos, enterprise coupon codes, and high-volume seat discounts.",
    unreadCount: 2,
    membersCount: 312,
  },
  {
    id: "channel-founders",
    type: "channel",
    name: "founders-and-builders",
    topic: "SaaS revenue milestones, product launch post-mortems, and tech stacks",
    description: "Connect with verified software creators to discuss roadmap features, ARR scaling, and APIs.",
    unreadCount: 0,
    membersCount: 195,
  },
  {
    id: "channel-procurement",
    type: "channel",
    name: "buyer-procurement",
    topic: "Enterprise RFP advice, contract negotiations, and stack audit questions",
    description: "Get peer feedback on vendor quotes, multi-year lock-ins, and compliance requirements.",
    unreadCount: 1,
    membersCount: 164,
  },
  {
    id: "channel-reviews",
    type: "channel",
    name: "product-feedback",
    topic: "Honest customer feedback, migration stories, and direct software benchmarks",
    description: "Unfiltered buyer thoughts, feature requests, and pros & cons comparisons.",
    unreadCount: 0,
    membersCount: 247,
  },
  {
    id: "dm-david-miller",
    type: "dm",
    name: "David Miller",
    recipient: COMMUNITY_MEMBERS.find((m) => m.id === "user-david-miller"),
    unreadCount: 1,
    lastMessage: {
      content: "Hey Alex! Just pushed the Okta SAML 2.0 update to production. Feel free to test with your Acme credentials.",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      senderName: "David Miller",
    },
  },
  {
    id: "dm-sarah-chen",
    type: "dm",
    name: "Sarah Chen",
    recipient: COMMUNITY_MEMBERS.find((m) => m.id === "user-sarah-chen"),
    unreadCount: 0,
    lastMessage: {
      content: "Our team applied the 20% annual discount for 30+ seats. Quote is active in your dashboard.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      senderName: "Sarah Chen",
    },
  },
  {
    id: "dm-elena-rostova",
    type: "dm",
    name: "Elena Rostova",
    recipient: COMMUNITY_MEMBERS.find((m) => m.id === "user-elena-rostova"),
    unreadCount: 0,
    lastMessage: {
      content: "Attaching the updated SOC-2 Type II audit PDF report for TaskFlow Workspace.",
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      senderName: "Elena Rostova",
    },
  },
  {
    id: "dm-saas-concierge",
    type: "dm",
    name: "SaaS MRKT Concierge",
    recipient: COMMUNITY_MEMBERS.find((m) => m.id === "user-concierge"),
    unreadCount: 0,
    lastMessage: {
      content: "Welcome to SaaS MRKT real-time community! How can we assist your software procurement today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
      senderName: "SaaS MRKT Concierge",
    },
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "channel-general": [
    {
      id: "msg-gen-1",
      roomId: "channel-general",
      senderId: "user-concierge",
      senderName: "SaaS MRKT Concierge",
      senderRole: "admin",
      senderTitle: "Platform Admin",
      content: "Welcome to the SaaS MRKT Community Chat! 👋 Connect in real-time with verified SaaS vendors, discover peer reviews, and negotiate software quotes directly.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      reactions: [
        { emoji: "🚀", count: 7, userIds: ["user-david-miller", "user-sarah-chen", "user-alex-morgan"] },
        { emoji: "❤️", count: 5, userIds: ["user-priya-sharma", "user-michael-vance"] },
      ],
      isPinned: true,
    },
    {
      id: "msg-gen-2",
      roomId: "channel-general",
      senderId: "user-priya-sharma",
      senderName: "Priya Sharma",
      senderRole: "buyer",
      senderTitle: "Director of Engineering @ CloudNova",
      content: "Has anyone here benchmarked **TaskFlow** vs **Manage360** for an engineering org of ~45 people? We need tight GitHub Actions integration and sprint burndown tracking.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      reactions: [{ emoji: "👍", count: 3, userIds: ["user-michael-vance", "user-alex-morgan"] }],
    },
    {
      id: "msg-gen-3",
      roomId: "channel-general",
      senderId: "user-david-miller",
      senderName: "David Miller",
      senderRole: "vendor",
      senderTitle: "Lead Architect @ GrowthFlow AI",
      content: "@Priya Sharma We actually use TaskFlow internally for our microservices sprints! Their webhook sync is sub-100ms and doesn't rate-limit GitHub PR triggers.",
      timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
      reactions: [{ emoji: "🔥", count: 4, userIds: ["user-priya-sharma", "user-alex-morgan"] }],
      replyToId: "msg-gen-2",
      replyToUser: "Priya Sharma",
      replyToText: "Has anyone here benchmarked TaskFlow vs Manage360...",
    },
    {
      id: "msg-gen-4",
      roomId: "channel-general",
      senderId: "user-sarah-chen",
      senderName: "Sarah Chen",
      senderRole: "vendor",
      senderTitle: "VP Partnerships @ Manage360",
      content: "Both tools are great! At Manage360, we also include automated payroll and HR milestones in the same dashboard if your team wants to consolidate multiple tool licenses under one annual invoice.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      reactions: [{ emoji: "💡", count: 3, userIds: ["user-michael-vance"] }],
    },
    {
      id: "msg-gen-5",
      roomId: "channel-general",
      senderId: "user-michael-vance",
      senderName: "Michael Vance",
      senderRole: "buyer",
      senderTitle: "VP Tech Ops @ FinTech Capital",
      content: "Appreciate the breakdown. Also, can confirm that Manage360's SOC 2 Type II report passed our bank partner audit without exceptions.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      reactions: [{ emoji: "👏", count: 2, userIds: ["user-sarah-chen"] }],
    },
  ],
  "channel-deals": [
    {
      id: "msg-deals-1",
      roomId: "channel-deals",
      senderId: "user-david-miller",
      senderName: "David Miller",
      senderRole: "vendor",
      senderTitle: "GrowthFlow AI",
      content: "🔥 **Marketplace Exclusive**: Use code `GROWTH25` on checkout for 25% off annual plans (up to 50 seats). Direct WhatsApp onboarding included for the first 10 teams.",
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      reactions: [
        { emoji: "🔥", count: 8, userIds: ["user-alex-morgan", "user-priya-sharma"] },
        { emoji: "⚡", count: 6, userIds: ["user-michael-vance"] },
      ],
      isPinned: true,
    },
    {
      id: "msg-deals-2",
      roomId: "channel-deals",
      senderId: "user-alex-morgan",
      senderName: "Alex Morgan",
      senderRole: "buyer",
      senderTitle: "Head of Product @ Acme",
      content: "Just redeemed the promo through our buyer dashboard. Works seamlessly with invoice billing!",
      timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      reactions: [{ emoji: "💯", count: 4, userIds: ["user-david-miller"] }],
    },
  ],
  "channel-founders": [
    {
      id: "msg-fnd-1",
      roomId: "channel-founders",
      senderId: "user-david-miller",
      senderName: "David Miller",
      senderRole: "vendor",
      senderTitle: "GrowthFlow AI",
      content: "Just crossed $42,500 MRR on SaaS MRKT! Biggest driver was adding transparent enterprise pricing and self-service due diligence dossiers. Buyers hate booking 4 sales calls just to see pricing.",
      timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      reactions: [
        { emoji: "🚀", count: 12, userIds: ["user-sarah-chen", "user-concierge"] },
        { emoji: "🎉", count: 9, userIds: ["user-elena-rostova"] },
      ],
      isPinned: true,
    },
    {
      id: "msg-fnd-2",
      roomId: "channel-founders",
      senderId: "user-sarah-chen",
      senderName: "Sarah Chen",
      senderRole: "vendor",
      senderTitle: "Manage360",
      content: "Huge congratulations David! We noticed the exact same trend with enterprise procurement officers—they want SLA guarantees up front.",
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      reactions: [{ emoji: "🤝", count: 5, userIds: ["user-david-miller"] }],
    },
  ],
  "channel-procurement": [
    {
      id: "msg-proc-1",
      roomId: "channel-procurement",
      senderId: "user-concierge",
      senderName: "SaaS MRKT Concierge",
      senderRole: "admin",
      senderTitle: "Platform Admin",
      content: "Reminder: All vendor purchase quotes negotiated in this channel or direct messages are backed by SaaS MRKT verified buyer protection and instant license keys.",
      timestamp: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
      reactions: [{ emoji: "🛡️", count: 6, userIds: ["user-alex-morgan"] }],
      isPinned: true,
    },
    {
      id: "msg-proc-2",
      roomId: "channel-procurement",
      senderId: "user-michael-vance",
      senderName: "Michael Vance",
      senderRole: "buyer",
      senderTitle: "VP Tech Ops @ FinTech Capital",
      content: "Looking for an Okta SSO compatible customer support software with audit logs and HIPAA compliance. Any recommendations?",
      timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      reactions: [{ emoji: "👀", count: 3, userIds: [] }],
    },
  ],
  "channel-reviews": [
    {
      id: "msg-rev-1",
      roomId: "channel-reviews",
      senderId: "user-priya-sharma",
      senderName: "Priya Sharma",
      senderRole: "buyer",
      senderTitle: "CloudNova",
      content: "Honest review after 3 months with **FinMate**: Bookkeeping reconciliation is 90% automated now. Saved our finance team roughly 14 hours every Friday.",
      timestamp: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
      reactions: [{ emoji: "⭐", count: 7, userIds: [] }],
    },
  ],
  "dm-david-miller": [
    {
      id: "msg-dm-dm-1",
      roomId: "dm-david-miller",
      senderId: "user-david-miller",
      senderName: "David Miller",
      senderRole: "vendor",
      content: "Hi Alex! Thank you for inquiring about GrowthFlow AI for Acme Cloud Ventures.",
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      reactions: [{ emoji: "👋", count: 1, userIds: ["user-alex-morgan"] }],
    },
    {
      id: "msg-dm-dm-2",
      roomId: "dm-david-miller",
      senderId: "user-alex-morgan",
      senderName: "Alex Morgan",
      senderRole: "buyer",
      content: "Hey David! We are looking to roll out 25 seats for our outbound growth team. Can you confirm if your Edge webhook supports custom HMAC signatures?",
      timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      reactions: [],
    },
    {
      id: "msg-dm-dm-3",
      roomId: "dm-david-miller",
      senderId: "user-david-miller",
      senderName: "David Miller",
      senderRole: "vendor",
      content: "Hey Alex! Just pushed the Okta SAML 2.0 update to production. Feel free to test with your Acme credentials.",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      reactions: [{ emoji: "🚀", count: 1, userIds: ["user-alex-morgan"] }],
    },
  ],
  "dm-sarah-chen": [
    {
      id: "msg-dm-sc-1",
      roomId: "dm-sarah-chen",
      senderId: "user-sarah-chen",
      senderName: "Sarah Chen",
      senderRole: "vendor",
      content: "Our team applied the 20% annual discount for 30+ seats. Quote is active in your dashboard.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      reactions: [{ emoji: "🎉", count: 1, userIds: ["user-alex-morgan"] }],
    },
  ],
  "dm-elena-rostova": [
    {
      id: "msg-dm-er-1",
      roomId: "dm-elena-rostova",
      senderId: "user-elena-rostova",
      senderName: "Elena Rostova",
      senderRole: "vendor",
      content: "Attaching the updated SOC-2 Type II audit PDF report for TaskFlow Workspace.",
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      attachmentName: "TaskFlow-SOC2-TypeII-Audit-2026.pdf",
      attachmentType: "file",
      reactions: [{ emoji: "📄", count: 1, userIds: ["user-alex-morgan"] }],
    },
  ],
  "dm-saas-concierge": [
    {
      id: "msg-dm-sm-1",
      roomId: "dm-saas-concierge",
      senderId: "user-concierge",
      senderName: "SaaS MRKT Concierge",
      senderRole: "admin",
      content: "Welcome to SaaS MRKT real-time community! How can we assist your software procurement today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
      reactions: [{ emoji: "⚡", count: 1, userIds: ["user-alex-morgan"] }],
    },
  ],
};

// Storage Access Utilities
export function getStoredChatRooms(): ChatRoom[] {
  if (typeof window === "undefined") return INITIAL_CHAT_ROOMS;
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_ROOMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // initialize defaults
    localStorage.setItem(CHAT_STORAGE_ROOMS_KEY, JSON.stringify(INITIAL_CHAT_ROOMS));
  } catch {}
  return INITIAL_CHAT_ROOMS;
}

export function saveStoredChatRooms(rooms: ChatRoom[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHAT_STORAGE_ROOMS_KEY, JSON.stringify(rooms));
  } catch {}
}

export function getStoredMessages(roomId: string): ChatMessage[] {
  if (typeof window === "undefined") return INITIAL_MESSAGES[roomId] || [];
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_MESSAGES_KEY);
    if (raw) {
      const all: Record<string, ChatMessage[]> = JSON.parse(raw);
      if (all && Array.isArray(all[roomId])) return all[roomId];
    } else {
      // initialize
      localStorage.setItem(CHAT_STORAGE_MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
    }
  } catch {}
  return INITIAL_MESSAGES[roomId] || [];
}

export function saveStoredMessage(message: ChatMessage): ChatMessage[] {
  if (typeof window === "undefined") return [message];
  let all: Record<string, ChatMessage[]> = {};
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_MESSAGES_KEY);
    if (raw) {
      all = JSON.parse(raw);
    } else {
      all = { ...INITIAL_MESSAGES };
    }
  } catch {
    all = { ...INITIAL_MESSAGES };
  }

  const list = all[message.roomId] || [];
  const updatedList = [...list, message];
  all[message.roomId] = updatedList;

  try {
    localStorage.setItem(CHAT_STORAGE_MESSAGES_KEY, JSON.stringify(all));
  } catch {}

  // Update room lastMessage and unread count for other members
  const rooms = getStoredChatRooms();
  const roomIndex = rooms.findIndex((r) => r.id === message.roomId);
  if (roomIndex >= 0) {
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      lastMessage: {
        content: message.content,
        timestamp: message.timestamp,
        senderName: message.senderName,
      },
    };
    saveStoredChatRooms(rooms);
  }

  // Broadcast to other tabs & windows
  broadcastChatEvent({ type: "NEW_MESSAGE", message });
  return updatedList;
}

export function toggleMessageReaction(roomId: string, messageId: string, emoji: string, userId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  let all: Record<string, ChatMessage[]> = {};
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_MESSAGES_KEY);
    if (raw) all = JSON.parse(raw);
    else all = { ...INITIAL_MESSAGES };
  } catch {
    all = { ...INITIAL_MESSAGES };
  }

  const list = all[roomId] || [];
  let updatedReactions: ChatMessage["reactions"] = [];

  const updatedList = list.map((msg) => {
    if (msg.id !== messageId) return msg;
    const existingRx = msg.reactions || [];
    const rxIndex = existingRx.findIndex((r) => r.emoji === emoji);

    let nextRx = [...existingRx];
    if (rxIndex >= 0) {
      const current = nextRx[rxIndex];
      const hasUser = current.userIds.includes(userId);
      if (hasUser) {
        // remove user reaction
        const nextUsers = current.userIds.filter((id) => id !== userId);
        if (nextUsers.length === 0) {
          nextRx.splice(rxIndex, 1);
        } else {
          nextRx[rxIndex] = { ...current, count: nextUsers.length, userIds: nextUsers };
        }
      } else {
        // add user reaction
        nextRx[rxIndex] = { ...current, count: current.count + 1, userIds: [...current.userIds, userId] };
      }
    } else {
      nextRx.push({ emoji, count: 1, userIds: [userId] });
    }
    updatedReactions = nextRx;
    return { ...msg, reactions: nextRx };
  });

  all[roomId] = updatedList;
  try {
    localStorage.setItem(CHAT_STORAGE_MESSAGES_KEY, JSON.stringify(all));
  } catch {}

  broadcastChatEvent({ type: "MESSAGE_REACTION", messageId, roomId, reactions: updatedReactions });
  return updatedList;
}

export function togglePinMessage(roomId: string, messageId: string): ChatMessage[] {
  let all: Record<string, ChatMessage[]> = {};
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_MESSAGES_KEY);
    if (raw) all = JSON.parse(raw);
    else all = { ...INITIAL_MESSAGES };
  } catch {
    all = { ...INITIAL_MESSAGES };
  }

  let isPinned = false;
  const list = all[roomId] || [];
  const updatedList = list.map((msg) => {
    if (msg.id === messageId) {
      isPinned = !msg.isPinned;
      return { ...msg, isPinned };
    }
    return msg;
  });

  all[roomId] = updatedList;
  try {
    localStorage.setItem(CHAT_STORAGE_MESSAGES_KEY, JSON.stringify(all));
  } catch {}

  broadcastChatEvent({ type: "PIN_MESSAGE", messageId, roomId, isPinned });
  return updatedList;
}

export function deleteStoredMessage(roomId: string, messageId: string): ChatMessage[] {
  let all: Record<string, ChatMessage[]> = {};
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_MESSAGES_KEY);
    if (raw) all = JSON.parse(raw);
    else all = { ...INITIAL_MESSAGES };
  } catch {
    all = { ...INITIAL_MESSAGES };
  }

  const list = all[roomId] || [];
  const updatedList = list.filter((m) => m.id !== messageId);
  all[roomId] = updatedList;

  try {
    localStorage.setItem(CHAT_STORAGE_MESSAGES_KEY, JSON.stringify(all));
  } catch {}

  broadcastChatEvent({ type: "DELETE_MESSAGE", messageId, roomId });
  return updatedList;
}

export function markRoomAsRead(roomId: string) {
  const rooms = getStoredChatRooms();
  const room = rooms.find((r) => r.id === roomId);
  if (room && room.unreadCount > 0) {
    room.unreadCount = 0;
    saveStoredChatRooms(rooms);
    broadcastChatEvent({ type: "ROOM_UPDATED", room });
  }
}

export function getTotalUnreadCount(): number {
  const rooms = getStoredChatRooms();
  return rooms.reduce((total, r) => total + (r.unreadCount || 0), 0);
}

export function createOrGetDirectMessage(user: ChatUser): ChatRoom {
  const rooms = getStoredChatRooms();
  const existing = rooms.find((r) => r.type === "dm" && r.recipient?.id === user.id);
  if (existing) return existing;

  const newDm: ChatRoom = {
    id: `dm-${user.id}`,
    type: "dm",
    name: user.name,
    recipient: user,
    unreadCount: 0,
    lastMessage: {
      content: "Conversation started",
      timestamp: new Date().toISOString(),
      senderName: user.name,
    },
  };

  const updatedRooms = [...rooms, newDm];
  saveStoredChatRooms(updatedRooms);
  broadcastChatEvent({ type: "ROOM_UPDATED", room: newDm });
  return newDm;
}

