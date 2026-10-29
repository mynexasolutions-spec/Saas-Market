"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage, ChatRoom, ChatUser, UserPresence } from "@/types/chat";
import {
  getStoredChatRooms,
  getStoredMessages,
  saveStoredMessage,
  toggleMessageReaction,
  togglePinMessage,
  deleteStoredMessage,
  markRoomAsRead,
  createOrGetDirectMessage,
  COMMUNITY_MEMBERS,
  CHAT_EVENT_NAME,
  CHAT_CHANNEL_NAME,
  broadcastChatEvent,
} from "@/utils/chatStorage";
import "./chat.css";

const POPULAR_EMOJIS = ["👍", "❤️", "🚀", "🔥", "💡", "👏", "🎉", "🤝", "💯", "⚡", "⭐", "💬"];

// Subtle browser synthesized audio ping for incoming messages
function playNotificationChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

export default function ChatClient() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>("channel-general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isMembersPaneOpen, setIsMembersPaneOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [userPresence, setUserPresence] = useState<UserPresence>("online");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Current active chat room
  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  // Current active user info
  const currentUserId = user?.id || "user-alex-morgan";
  const currentUserName = user?.name || "Alex Morgan";
  const currentUserRole = user?.role || "buyer";
  const currentUserTitle = user?.title || (user?.role === "vendor" ? "Verified Vendor" : "Software Buyer");

  // Load rooms and initial messages on mount
  useEffect(() => {
    const loadedRooms = getStoredChatRooms();
    setRooms(loadedRooms);
    const initialMsgs = getStoredMessages(activeRoomId);
    setMessages(initialMsgs);
    markRoomAsRead(activeRoomId);
  }, [activeRoomId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time listener via BroadcastChannel and window CustomEvent
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      if ("BroadcastChannel" in window) {
        bc = new BroadcastChannel(CHAT_CHANNEL_NAME);
      }
    } catch {}

    const handleRealtimeEvent = (event: MessageEvent | CustomEvent) => {
      const data = "data" in event ? event.data : (event as CustomEvent).detail;
      if (!data || !data.type) return;

      if (data.type === "NEW_MESSAGE") {
        const newMsg: ChatMessage = data.message;
        if (newMsg.roomId === activeRoomId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          markRoomAsRead(activeRoomId);
        } else {
          // Play notification chime if message is in another room
          playNotificationChime();
        }
        setRooms(getStoredChatRooms());
      } else if (data.type === "MESSAGE_REACTION") {
        if (data.roomId === activeRoomId) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === data.messageId ? { ...msg, reactions: data.reactions } : msg))
          );
        }
      } else if (data.type === "PIN_MESSAGE") {
        if (data.roomId === activeRoomId) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === data.messageId ? { ...msg, isPinned: data.isPinned } : msg))
          );
        }
      } else if (data.type === "DELETE_MESSAGE") {
        if (data.roomId === activeRoomId) {
          setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
        }
      } else if (data.type === "TYPING_START") {
        if (data.roomId === activeRoomId && data.user.id !== currentUserId) {
          setTypingUsers((prev) => (prev.includes(data.user.name) ? prev : [...prev, data.user.name]));
        }
      } else if (data.type === "TYPING_STOP") {
        if (data.roomId === activeRoomId) {
          setTypingUsers((prev) => prev.filter((name) => name !== data.user?.name));
        }
      } else if (data.type === "ROOM_UPDATED") {
        setRooms(getStoredChatRooms());
      }
    };

    if (bc) {
      bc.onmessage = handleRealtimeEvent;
    }
    window.addEventListener(CHAT_EVENT_NAME as unknown as string, handleRealtimeEvent as EventListener);

    return () => {
      if (bc) bc.close();
      window.removeEventListener(CHAT_EVENT_NAME as unknown as string, handleRealtimeEvent as EventListener);
    };
  }, [activeRoomId, currentUserId]);

  // Handle switching rooms
  const handleSelectRoom = useCallback(
    (roomId: string) => {
      setActiveRoomId(roomId);
      markRoomAsRead(roomId);
      setMessages(getStoredMessages(roomId));
      setIsMobileSidebarOpen(false);
      setReplyTo(null);
      setIsEmojiPickerOpen(false);
      setTypingUsers([]);
      // focus input
      setTimeout(() => textareaRef.current?.focus(), 100);
    },
    []
  );

  // Send Message Handler
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      roomId: activeRoomId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: user?.avatarUrl,
      senderRole: currentUserRole,
      senderTitle: currentUserTitle,
      content: trimmed,
      timestamp: new Date().toISOString(),
      reactions: [],
      replyToId: replyTo?.id,
      replyToText: replyTo ? replyTo.content.slice(0, 60) + (replyTo.content.length > 60 ? "..." : "") : undefined,
      replyToUser: replyTo?.senderName,
    };

    const updated = saveStoredMessage(newMessage);
    setMessages(updated);
    setInputText("");
    setReplyTo(null);
    setIsEmojiPickerOpen(false);
    setRooms(getStoredChatRooms());

    // Broadcast typing stop
    broadcastChatEvent({ type: "TYPING_STOP", roomId: activeRoomId, userId: currentUserId });
  };

  // Typing emitter
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    broadcastChatEvent({
      type: "TYPING_START",
      roomId: activeRoomId,
      user: { id: currentUserId, name: currentUserName },
    });

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      broadcastChatEvent({ type: "TYPING_STOP", roomId: activeRoomId, userId: currentUserId });
    }, 2000);
  };

  // Keyboard shortcut (Enter to send, Shift+Enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Reaction toggler
  const handleReactionClick = (messageId: string, emoji: string) => {
    const updated = toggleMessageReaction(activeRoomId, messageId, emoji, currentUserId);
    setMessages(updated);
  };

  // Pin message
  const handleTogglePin = (messageId: string) => {
    const updated = togglePinMessage(activeRoomId, messageId);
    setMessages(updated);
  };

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    const updated = deleteStoredMessage(activeRoomId, messageId);
    setMessages(updated);
  };

  // Start DM with community member
  const handleStartDM = (member: ChatUser) => {
    const dmRoom = createOrGetDirectMessage(member);
    setRooms(getStoredChatRooms());
    handleSelectRoom(dmRoom.id);
  };

  // Filtered rooms
  const channelRooms = rooms.filter(
    (r) => r.type === "channel" && r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const dmRooms = rooms.filter(
    (r) => r.type === "dm" && r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered messages inside active room
  const displayMessages = messageSearch.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(messageSearch.toLowerCase()))
    : messages;

  // Pinned messages in room
  const pinnedMessages = messages.filter((m) => m.isPinned);

  return (
    <PageLayout activeNav="chat" noContainer>
      <div className="chat-app-container">
        {/* 1. Left Mini Server Rail (Discord Style) */}
        <div className="chat-server-rail" aria-label="Chat navigation rail">
          <Link href="/" className="chat-rail-icon" title="SaaS MRKT Home">
            <Image src="/logo.png" alt="SaaS MRKT" width={28} height={28} style={{ objectFit: "contain" }} />
          </Link>

          <div className="chat-rail-divider" />

          <button
            type="button"
            className="chat-rail-icon is-active"
            title="SaaS Community Channels"
            onClick={() => handleSelectRoom("channel-general")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {rooms.some((r) => r.unreadCount > 0) && (
              <span className="chat-rail-badge">
                {rooms.reduce((acc, r) => acc + (r.unreadCount || 0), 0)}
              </span>
            )}
          </button>

          <button
            type="button"
            className="chat-rail-icon"
            title="Direct Messages"
            onClick={() => {
              const firstDm = rooms.find((r) => r.type === "dm");
              if (firstDm) handleSelectRoom(firstDm.id);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </button>

          <Link href="/products" className="chat-rail-icon" title="Explore Marketplace Products">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
        </div>

        {/* 2. Channels & Direct Messages Sidebar */}
        <div className={`chat-sidebar ${isMobileSidebarOpen ? "is-open" : ""}`}>
          <div className="chat-sidebar-header">
            <div className="chat-sidebar-community-name">
              <span>SaaS MRKT Chat</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#6366F1" stroke="#6366F1">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              </svg>
            </div>
          </div>

          <div className="chat-search-wrap">
            <div style={{ position: "relative" }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2.2"
                style={{ position: "absolute", left: "9px", top: "8px" }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="chat-search-input"
                placeholder="Search rooms or DMs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="chat-sidebar-scroll">
            {/* CHANNELS SECTION */}
            <div className="chat-sidebar-group-title">
              <span>COMMUNITY CHANNELS</span>
            </div>

            {channelRooms.map((room) => (
              <div
                key={room.id}
                className={`chat-room-item ${activeRoomId === room.id ? "is-active" : ""}`}
                onClick={() => handleSelectRoom(room.id)}
              >
                <span className="chat-room-hash">#</span>
                <span className="chat-room-label">{room.name}</span>
                {room.unreadCount > 0 && <span className="chat-room-unread-badge">{room.unreadCount}</span>}
              </div>
            ))}

            {/* DIRECT MESSAGES SECTION */}
            <div className="chat-sidebar-group-title" style={{ marginTop: "10px" }}>
              <span>DIRECT MESSAGES</span>
              <button
                type="button"
                style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: "1rem" }}
                title="Start a new message"
                onClick={() => handleStartDM(COMMUNITY_MEMBERS[0])}
              >
                +
              </button>
            </div>

            {dmRooms.map((room) => {
              const recipient = room.recipient || COMMUNITY_MEMBERS[0];
              return (
                <div
                  key={room.id}
                  className={`chat-room-item ${activeRoomId === room.id ? "is-active" : ""}`}
                  onClick={() => handleSelectRoom(room.id)}
                >
                  <div className="chat-dm-avatar-wrap">
                    <div className="chat-dm-avatar">{recipient.initials}</div>
                    <span className={`chat-presence-dot ${recipient.presence || "online"}`} />
                  </div>
                  <span className="chat-room-label">{recipient.name}</span>
                  {room.unreadCount > 0 && <span className="chat-room-unread-badge">{room.unreadCount}</span>}
                </div>
              );
            })}
          </div>

          {/* Current User Profile Footer */}
          <div className="chat-user-footer">
            <div className="chat-user-footer-meta">
              <div className="chat-dm-avatar-wrap" style={{ width: "32px", height: "32px" }}>
                <div className="chat-dm-avatar" style={{ fontSize: "0.82rem" }}>
                  {currentUserName.slice(0, 2).toUpperCase()}
                </div>
                <span className={`chat-presence-dot ${userPresence}`} />
              </div>
              <div className="chat-user-footer-names">
                <div className="chat-user-footer-name">{currentUserName}</div>
                <div className="chat-user-footer-role">
                  <select
                    className="chat-status-select"
                    value={userPresence}
                    onChange={(e) => setUserPresence(e.target.value as UserPresence)}
                    title="Change presence status"
                  >
                    <option value="online">🟢 Online</option>
                    <option value="idle">🟡 Idle</option>
                    <option value="offline">⚪ Invisible</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Main Chat Viewport */}
        <div className="chat-main-viewport">
          {/* Top Header */}
          <div className="chat-top-header">
            <div className="chat-top-left">
              <button
                type="button"
                className="chat-mobile-toggle-btn"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                aria-label="Toggle channels menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              <div className="chat-header-title-box">
                {activeRoom?.type === "channel" ? (
                  <span style={{ fontSize: "1.25rem", color: "#6366F1", fontWeight: 800 }}>#</span>
                ) : (
                  <div className="chat-dm-avatar-wrap" style={{ width: "24px", height: "24px" }}>
                    <div className="chat-dm-avatar" style={{ fontSize: "0.68rem" }}>
                      {activeRoom?.recipient?.initials || "DM"}
                    </div>
                    <span className={`chat-presence-dot ${activeRoom?.recipient?.presence || "online"}`} />
                  </div>
                )}
                <h2 className="chat-header-title">{activeRoom?.name}</h2>
                {activeRoom?.topic && <span className="chat-header-topic">{activeRoom.topic}</span>}
              </div>
            </div>

            <div className="chat-top-actions">
              {/* Message Search Filter */}
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Filter messages..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  style={{
                    padding: "4px 8px 4px 26px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    fontSize: "0.78rem",
                    width: "140px",
                  }}
                />
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2.2"
                  style={{ position: "absolute", left: "8px", top: "8px" }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              {/* Members toggle button */}
              <button
                type="button"
                className={`chat-action-icon-btn ${isMembersPaneOpen ? "is-active" : ""}`}
                title="Toggle members list"
                onClick={() => setIsMembersPaneOpen(!isMembersPaneOpen)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </button>
            </div>
          </div>

          {/* Pinned Announcement / Tip Banner */}
          {pinnedMessages.length > 0 && (
            <div className="chat-pinned-banner">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <span style={{ fontSize: "1rem" }}>📌</span>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <strong>Pinned:</strong> {pinnedMessages[0].content}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePin(pinnedMessages[0].id)}
                style={{ background: "none", border: "none", color: "#92400E", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700 }}
              >
                Unpin
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div className="chat-messages-container">
            <div className="chat-date-divider">
              <span>Today in {activeRoom?.name}</span>
            </div>

            {displayMessages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748B" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💬</div>
                <h3 style={{ margin: "0 0 0.25rem", color: "#0F172A", fontSize: "1.1rem" }}>
                  Welcome to #{activeRoom?.name}!
                </h3>
                <p style={{ margin: 0, fontSize: "0.85rem" }}>
                  This is the start of the #{activeRoom?.name} channel. Send a message to start the conversation!
                </p>
              </div>
            ) : (
              displayMessages.map((msg) => {
                const isOwn = msg.senderId === currentUserId;
                const dateStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={msg.id} className={`chat-message-row ${msg.isPinned ? "is-pinned" : ""}`}>
                    {/* Sender Avatar */}
                    <div
                      className="chat-message-avatar"
                      title={`Send message to ${msg.senderName}`}
                      onClick={() => {
                        const targetUser = COMMUNITY_MEMBERS.find((m) => m.id === msg.senderId);
                        if (targetUser && targetUser.id !== currentUserId) {
                          handleStartDM(targetUser);
                        }
                      }}
                    >
                      {msg.senderName.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="chat-message-content-col">
                      {/* Replying To Banner */}
                      {msg.replyToText && (
                        <div className="chat-reply-ref">
                          <span>↳ Replying to</span>
                          <span className="chat-reply-user">@{msg.replyToUser}:</span>
                          <span style={{ fontStyle: "italic" }}>{msg.replyToText}</span>
                        </div>
                      )}

                      <div className="chat-message-header">
                        <span className="chat-sender-name">{msg.senderName}</span>
                        <span className={`chat-sender-badge ${msg.senderRole}`}>
                          {msg.senderRole === "admin" ? "Admin" : msg.senderRole === "vendor" ? "Verified Vendor" : "Buyer"}
                        </span>
                        <span className="chat-message-time">{dateStr}</span>
                      </div>

                      <div className="chat-message-body">
                        {msg.content}
                      </div>

                      {/* File or Image Attachment */}
                      {msg.attachmentName && (
                        <div className="chat-attachment-pill">
                          <span>📄</span>
                          <span>{msg.attachmentName}</span>
                        </div>
                      )}

                      {/* Reactions Tray */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="chat-reactions-tray">
                          {msg.reactions.map((rx) => {
                            const hasReacted = rx.userIds.includes(currentUserId);
                            return (
                              <button
                                key={rx.emoji}
                                type="button"
                                className={`chat-reaction-chip ${hasReacted ? "has-user-reacted" : ""}`}
                                onClick={() => handleReactionClick(msg.id, rx.emoji)}
                              >
                                <span>{rx.emoji}</span>
                                <span>{rx.count}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Message Hover Actions Bar */}
                    <div className="chat-message-hover-actions">
                      <button
                        type="button"
                        className="chat-hover-btn"
                        title="React thumbs up"
                        onClick={() => handleReactionClick(msg.id, "👍")}
                      >
                        👍
                      </button>
                      <button
                        type="button"
                        className="chat-hover-btn"
                        title="React heart"
                        onClick={() => handleReactionClick(msg.id, "❤️")}
                      >
                        ❤️
                      </button>
                      <button
                        type="button"
                        className="chat-hover-btn"
                        title="React fire"
                        onClick={() => handleReactionClick(msg.id, "🔥")}
                      >
                        🔥
                      </button>
                      <button
                        type="button"
                        className="chat-hover-btn"
                        title="Reply to message"
                        onClick={() => {
                          setReplyTo(msg);
                          textareaRef.current?.focus();
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 17 4 12 9 7" />
                          <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="chat-hover-btn"
                        title={msg.isPinned ? "Unpin message" : "Pin message"}
                        onClick={() => handleTogglePin(msg.id)}
                      >
                        📌
                      </button>
                      {isOwn && (
                        <button
                          type="button"
                          className="chat-hover-btn"
                          title="Delete message"
                          onClick={() => handleDeleteMessage(msg.id)}
                          style={{ color: "#EF4444" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="chat-typing-indicator">
              <span className="chat-typing-dots">
                <span />
                <span />
                <span />
              </span>
              <span>{typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...</span>
            </div>
          )}

          {/* 5. Message Input Bar */}
          <div className="chat-input-wrapper">
            {replyTo && (
              <div className="chat-replying-banner">
                <span>
                  Replying to <strong>@{replyTo.senderName}</strong>: &ldquo;{replyTo.content.slice(0, 45)}...&rdquo;
                </span>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>
            )}

            <div className="chat-input-box">
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                rows={1}
                placeholder={`Message #${activeRoom?.name || "chat"}...`}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />

              <div className="chat-input-actions">
                {/* Emoji Trigger */}
                <button
                  type="button"
                  className="chat-tool-btn"
                  title="Insert emoji"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                >
                  😊
                </button>

                {/* Code snippet helper */}
                <button
                  type="button"
                  className="chat-tool-btn"
                  title="Insert code block"
                  onClick={() => {
                    setInputText((prev) => prev + "```code\n\n```");
                    textareaRef.current?.focus();
                  }}
                >
                  &lt;/&gt;
                </button>

                {/* Attachment simulator */}
                <button
                  type="button"
                  className="chat-tool-btn"
                  title="Attach file / proposal"
                  onClick={() => {
                    setInputText((prev) => prev + " 📎 [Attached Specification Doc.pdf]");
                    textareaRef.current?.focus();
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>

                {/* Send Button */}
                <button
                  type="button"
                  className="chat-send-btn"
                  disabled={!inputText.trim()}
                  onClick={() => handleSendMessage()}
                  title="Send message (Enter)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>

              {/* Emoji Picker Popover */}
              {isEmojiPickerOpen && (
                <div className="chat-emoji-popover">
                  {POPULAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setInputText((prev) => prev + emoji);
                        setIsEmojiPickerOpen(false);
                        textareaRef.current?.focus();
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. Right Members & Info Pane (Discord Style) */}
        {isMembersPaneOpen && (
          <div className="chat-right-pane is-open">
            {activeRoom?.type === "dm" && activeRoom.recipient ? (
              <div className="chat-dm-profile-card">
                <div className="chat-dm-big-avatar">{activeRoom.recipient.initials}</div>
                <h4>{activeRoom.recipient.name}</h4>
                <p>{activeRoom.recipient.title || "Marketplace User"}</p>
                <div style={{ display: "inline-block", background: "#EEF2FF", color: "#4F46E5", fontSize: "0.74rem", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px", marginBottom: "12px" }}>
                  {activeRoom.recipient.role.toUpperCase()}
                </div>
                {activeRoom.recipient.bio && (
                  <p style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.4, textAlign: "left", background: "#FFFFFF", padding: "10px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                    {activeRoom.recipient.bio}
                  </p>
                )}
                {activeRoom.recipient.website && (
                  <a
                    href={activeRoom.recipient.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "0.8rem", color: "#4F46E5", fontWeight: 600, textDecoration: "none", display: "block", marginTop: "8px" }}
                  >
                    Visit Website &rarr;
                  </a>
                )}
              </div>
            ) : (
              <div>
                <div className="chat-member-group-title">
                  <span>ADMINISTRATORS (1)</span>
                </div>
                {COMMUNITY_MEMBERS.filter((m) => m.role === "admin").map((member) => (
                  <div key={member.id} className="chat-member-row" onClick={() => handleStartDM(member)}>
                    <div className="chat-member-avatar-wrap">
                      <div className="chat-dm-avatar">{member.initials}</div>
                      <span className={`chat-presence-dot ${member.presence}`} />
                    </div>
                    <div className="chat-member-info">
                      <span className="chat-member-name">{member.name}</span>
                      <span className="chat-member-status-sub">{member.customStatus || "Online"}</span>
                    </div>
                  </div>
                ))}

                <div className="chat-member-group-title">
                  <span>VERIFIED VENDORS (3)</span>
                </div>
                {COMMUNITY_MEMBERS.filter((m) => m.role === "vendor").map((member) => (
                  <div key={member.id} className="chat-member-row" onClick={() => handleStartDM(member)}>
                    <div className="chat-member-avatar-wrap">
                      <div className="chat-dm-avatar">{member.initials}</div>
                      <span className={`chat-presence-dot ${member.presence}`} />
                    </div>
                    <div className="chat-member-info">
                      <span className="chat-member-name">{member.name}</span>
                      <span className="chat-member-status-sub">{member.company}</span>
                    </div>
                  </div>
                ))}

                <div className="chat-member-group-title">
                  <span>SOFTWARE BUYERS (4)</span>
                </div>
                {COMMUNITY_MEMBERS.filter((m) => m.role === "buyer").map((member) => (
                  <div key={member.id} className="chat-member-row" onClick={() => handleStartDM(member)}>
                    <div className="chat-member-avatar-wrap">
                      <div className="chat-dm-avatar">{member.initials}</div>
                      <span className={`chat-presence-dot ${member.presence}`} />
                    </div>
                    <div className="chat-member-info">
                      <span className="chat-member-name">{member.name}</span>
                      <span className="chat-member-status-sub">{member.company || "Enterprise Buyer"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

