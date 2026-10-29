"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage, ChatRoom, ChatUser } from "@/types/chat";
import {
  getStoredChatRooms,
  getStoredMessages,
  saveStoredMessage,
  toggleMessageReaction,
  markRoomAsRead,
  getTotalUnreadCount,
  COMMUNITY_MEMBERS,
  CHAT_EVENT_NAME,
  CHAT_CHANNEL_NAME,
  broadcastChatEvent,
} from "@/utils/chatStorage";
import "./chat-widget.css";

const POPULAR_EMOJIS = ["👍", "❤️", "🚀", "🔥", "💡", "👏", "🎉", "💯"];

export default function FloatingChatButton() {
  const pathname = usePathname();
  const { user, isInitialized, openAuth } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"channels" | "dms">("channels");
  const [activeRoomId, setActiveRoomId] = useState<string>("channel-general");
  const [activeView, setActiveView] = useState<"rooms" | "convo">("rooms");
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentUserId = user?.id || "user-alex-morgan";
  const currentUserName = user?.name || "Alex Morgan";
  const currentUserRole = user?.role || "buyer";
  const currentUserTitle = user?.title || (user?.role === "vendor" ? "Verified Vendor" : "Software Buyer");

  // Load initial rooms & unread count
  useEffect(() => {
    const loaded = getStoredChatRooms();
    setRooms(loaded);
    setUnreadCount(getTotalUnreadCount());
  }, []);

  // Update messages when room changes
  useEffect(() => {
    if (activeRoomId) {
      setMessages(getStoredMessages(activeRoomId));
    }
  }, [activeRoomId]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen && activeView === "convo") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, activeView]);

  // Auto-close popup if user logs out
  useEffect(() => {
    if (!user && isOpen) {
      setIsOpen(false);
    }
  }, [user, isOpen]);

  // Listen to global open popup event & real-time chat events
  useEffect(() => {
    const handleOpenPopup = (e: Event) => {
      if (!user) {
        openAuth("login");
        return;
      }
      const detail = (e as CustomEvent<{ roomId?: string }>).detail;
      setIsOpen(true);
      if (detail?.roomId) {
        setActiveRoomId(detail.roomId);
        setActiveView("convo");
        markRoomAsRead(detail.roomId);
      }
    };

    window.addEventListener("saas_mrkt_open_chat_popup", handleOpenPopup);

    let bc: BroadcastChannel | null = null;
    try {
      if ("BroadcastChannel" in window) {
        bc = new BroadcastChannel(CHAT_CHANNEL_NAME);
      }
    } catch {}

    const handleRealtime = (event: MessageEvent | CustomEvent) => {
      const data = "data" in event ? event.data : (event as CustomEvent).detail;
      if (!data || !data.type) return;

      if (data.type === "NEW_MESSAGE") {
        const newMsg: ChatMessage = data.message;
        if (newMsg.roomId === activeRoomId) {
          setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
        }
        setRooms(getStoredChatRooms());
        setUnreadCount(getTotalUnreadCount());
      } else if (data.type === "MESSAGE_REACTION") {
        if (data.roomId === activeRoomId) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === data.messageId ? { ...msg, reactions: data.reactions } : msg))
          );
        }
      } else if (data.type === "ROOM_UPDATED") {
        setRooms(getStoredChatRooms());
        setUnreadCount(getTotalUnreadCount());
      }
    };

    if (bc) bc.onmessage = handleRealtime;
    window.addEventListener(CHAT_EVENT_NAME as unknown as string, handleRealtime as EventListener);
    window.addEventListener("storage", handleRealtime as EventListener);

    return () => {
      window.removeEventListener("saas_mrkt_open_chat_popup", handleOpenPopup);
      if (bc) bc.close();
      window.removeEventListener(CHAT_EVENT_NAME as unknown as string, handleRealtime as EventListener);
      window.removeEventListener("storage", handleRealtime as EventListener);
    };
  }, [activeRoomId]);

  // Handle room selection
  const handleOpenRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setActiveView("convo");
    markRoomAsRead(roomId);
    setMessages(getStoredMessages(roomId));
    setRooms(getStoredChatRooms());
    setUnreadCount(getTotalUnreadCount());
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      roomId: activeRoomId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      senderTitle: currentUserTitle,
      content: trimmed,
      timestamp: new Date().toISOString(),
      reactions: [],
      replyToId: replyTo?.id,
      replyToText: replyTo ? replyTo.content.slice(0, 50) + "..." : undefined,
      replyToUser: replyTo?.senderName,
    };

    const updated = saveStoredMessage(newMessage);
    setMessages(updated);
    setInputText("");
    setReplyTo(null);
    setIsEmojiPickerOpen(false);
    setRooms(getStoredChatRooms());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    const updated = toggleMessageReaction(activeRoomId, messageId, emoji, currentUserId);
    setMessages(updated);
  };

  // Active room
  const currentRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];
  const channelRooms = rooms.filter((r) => r.type === "channel");
  const dmRooms = rooms.filter((r) => r.type === "dm");

  // Handle launcher click: if not logged in, prompt user to log in!
  const handleLauncherClick = () => {
    if (!user) {
      openAuth("login");
      return;
    }
    setIsOpen(true);
    setRooms(getStoredChatRooms());
    setUnreadCount(getTotalUnreadCount());
  };

  return (
    <>
      {/* 1. Floating Launcher Button (Bottom Right) */}
      {!isOpen && (
        <button
          type="button"
          id="floating-community-chat-btn"
          className="chat-widget-launcher-btn"
          onClick={handleLauncherClick}
          aria-label="Open Community Chat Popup"
          title="Open SaaS MRKT Community Chat"
        >
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {unreadCount > 0 && <span className="chat-widget-launcher-badge">{unreadCount}</span>}
          </div>
          <span>Chat</span>
          <span className="chat-widget-launcher-dot" title="Live Active" />
        </button>
      )}

      {/* 2. Floating Popup Window (Right Docked) */}
      {isOpen && (
        <div className="chat-popup-container" role="dialog" aria-label="Community Chat Popup">
          <div className="chat-popup-accent-line" />

          {/* Popup Header */}
          <div className="chat-popup-header">
            <div className="chat-popup-header-title-box">
              <div className="chat-popup-header-icon">
                {activeView === "convo" && currentRoom ? (
                  currentRoom.type === "channel" ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="9" x2="20" y2="9" />
                      <line x1="4" y1="15" x2="20" y2="15" />
                      <line x1="10" y1="3" x2="8" y2="21" />
                      <line x1="16" y1="3" x2="14" y2="21" />
                    </svg>
                  ) : (
                    currentRoom.recipient?.initials || "DM"
                  )
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="chat-popup-header-title">
                  {activeView === "convo" && currentRoom ? currentRoom.name : "SaaS MRKT Chat"}
                </h3>
                <span className="chat-popup-header-sub">
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
                  {activeView === "convo" && currentRoom?.topic
                    ? currentRoom.topic.slice(0, 32) + "..."
                    : "Real-time Community"}
                </span>
              </div>
            </div>

            <div className="chat-popup-header-actions">
              {/* Close / Minimize Popup */}
              <button
                type="button"
                className="chat-popup-action-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat popup"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Switcher Tabs (Channels vs DMs) */}
          <div className="chat-popup-nav-tabs">
            <button
              type="button"
              className={`chat-popup-tab-btn ${activeTab === "channels" ? "is-active" : ""}`}
              onClick={() => {
                setActiveTab("channels");
                setActiveView("rooms");
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="4" y1="9" x2="20" y2="9" />
                <line x1="4" y1="15" x2="20" y2="15" />
                <line x1="10" y1="3" x2="8" y2="21" />
                <line x1="16" y1="3" x2="14" y2="21" />
              </svg>
              <span>Channels</span>
              {channelRooms.some((r) => r.unreadCount > 0) && (
                <span className="chat-popup-tab-badge">
                  {channelRooms.reduce((acc, r) => acc + (r.unreadCount || 0), 0)}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`chat-popup-tab-btn ${activeTab === "dms" ? "is-active" : ""}`}
              onClick={() => {
                setActiveTab("dms");
                setActiveView("rooms");
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>Direct Messages</span>
              {dmRooms.some((r) => r.unreadCount > 0) && (
                <span className="chat-popup-tab-badge">
                  {dmRooms.reduce((acc, r) => acc + (r.unreadCount || 0), 0)}
                </span>
              )}
            </button>
          </div>

          {/* VIEW 1: Rooms List (Channels or DMs) */}
          {activeView === "rooms" && (
            <div className="chat-popup-rooms-list">
              {activeTab === "channels" ? (
                channelRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`chat-popup-room-row ${activeRoomId === room.id ? "is-active" : ""}`}
                    onClick={() => handleOpenRoom(room.id)}
                  >
                    <div className="chat-popup-room-avatar-box">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="9" x2="20" y2="9" />
                        <line x1="4" y1="15" x2="20" y2="15" />
                        <line x1="10" y1="3" x2="8" y2="21" />
                        <line x1="16" y1="3" x2="14" y2="21" />
                      </svg>
                    </div>
                    <div className="chat-popup-room-meta">
                      <div className="chat-popup-room-title-row">
                        <span className="chat-popup-room-name">{room.name}</span>
                        {room.unreadCount > 0 && (
                          <span className="chat-popup-unread-pill">{room.unreadCount}</span>
                        )}
                      </div>
                      <p className="chat-popup-room-desc">{room.description || room.topic}</p>
                    </div>
                  </div>
                ))
              ) : (
                dmRooms.map((room) => {
                  const recipient = room.recipient || COMMUNITY_MEMBERS[0];
                  return (
                    <div
                      key={room.id}
                      className={`chat-popup-room-row ${activeRoomId === room.id ? "is-active" : ""}`}
                      onClick={() => handleOpenRoom(room.id)}
                    >
                      <div className="chat-popup-room-avatar-box">
                        {recipient.initials}
                        <span
                          style={{
                            position: "absolute",
                            bottom: "-1px",
                            right: "-1px",
                            width: "9px",
                            height: "9px",
                            borderRadius: "50%",
                            background: recipient.presence === "idle" ? "#F59E0B" : recipient.presence === "offline" ? "#94A3B8" : "#10B981",
                            border: "1.5px solid #FFFFFF",
                          }}
                        />
                      </div>
                      <div className="chat-popup-room-meta">
                        <div className="chat-popup-room-title-row">
                          <span className="chat-popup-room-name">{recipient.name}</span>
                          {room.unreadCount > 0 && (
                            <span className="chat-popup-unread-pill">{room.unreadCount}</span>
                          )}
                        </div>
                        <p className="chat-popup-room-desc">
                          {room.lastMessage?.content || recipient.company || "Direct conversation"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* VIEW 2: Active Conversation */}
          {activeView === "convo" && (
            <div className="chat-popup-convo-container">
              {/* Back to Rooms Topbar */}
              <div className="chat-popup-convo-topbar">
                <button
                  type="button"
                  className="chat-popup-back-btn"
                  onClick={() => setActiveView("rooms")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  <span>Rooms</span>
                </button>

                <span className="chat-popup-convo-title">
                  {currentRoom?.type === "channel" ? `#${currentRoom.name}` : currentRoom?.name}
                </span>

                <div style={{ width: "40px" }} />
              </div>

              {/* Messages Stream */}
              <div className="chat-popup-messages-stream">
                {messages.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#64748B", fontSize: "0.85rem" }}>
                    No messages yet. Send a message to start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    return (
                      <div key={msg.id} className="chat-popup-message-item">
                        <div className="chat-popup-message-avatar">
                          {msg.senderName.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="chat-popup-message-col">
                          {msg.replyToText && (
                            <div style={{ fontSize: "0.7rem", color: "#64748B", borderLeft: "2px solid #CBD5E1", paddingLeft: "4px", marginBottom: "2px" }}>
                              ↳ @{msg.replyToUser}: {msg.replyToText}
                            </div>
                          )}

                          <div className="chat-popup-message-header">
                            <span className="chat-popup-sender-name">{msg.senderName}</span>
                            <span className={`chat-popup-sender-role ${msg.senderRole}`}>
                              {msg.senderRole === "admin" ? "Admin" : msg.senderRole === "vendor" ? "Vendor" : "Buyer"}
                            </span>
                            <span className="chat-popup-time">{timeStr}</span>
                          </div>

                          <div className="chat-popup-message-text">{msg.content}</div>

                          {/* Quick Reactions */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="chat-popup-reactions">
                              {msg.reactions.map((rx) => {
                                const hasUser = rx.userIds.includes(currentUserId);
                                return (
                                  <button
                                    key={rx.emoji}
                                    type="button"
                                    className={`chat-popup-rx-chip ${hasUser ? "has-user" : ""}`}
                                    onClick={() => handleReaction(msg.id, rx.emoji)}
                                  >
                                    <span>{rx.emoji}</span>
                                    <span>{rx.count}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Quick hover reaction */}
                        <div style={{ position: "absolute", top: "2px", right: "6px" }}>
                          <button
                            type="button"
                            onClick={() => handleReaction(msg.id, "👍")}
                            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", opacity: 0.6 }}
                            title="React 👍"
                          >
                            👍
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReaction(msg.id, "❤️")}
                            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", opacity: 0.6 }}
                            title="React ❤️"
                          >
                            ❤️
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing bar */}
              {typingUsers.length > 0 && (
                <div className="chat-popup-typing-bar">
                  <span>{typingUsers.join(", ")} is typing...</span>
                </div>
              )}

              {/* Input Box */}
              <div className="chat-popup-input-wrapper">
                {replyTo && (
                  <div className="chat-popup-reply-bar">
                    <span>Replying to @{replyTo.senderName}</span>
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="chat-popup-input-box">
                  <textarea
                    ref={textareaRef}
                    className="chat-popup-textarea"
                    rows={1}
                    placeholder={`Message ${currentRoom?.name || "chat"}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />

                  <button
                    type="button"
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", padding: "2px 4px" }}
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                    title="Insert emoji"
                  >
                    😊
                  </button>

                  <button
                    type="button"
                    className="chat-popup-send-btn"
                    disabled={!inputText.trim()}
                    onClick={() => handleSendMessage()}
                    title="Send message (Enter)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>

                {isEmojiPickerOpen && (
                  <div className="chat-popup-emoji-picker">
                    {POPULAR_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInputText((prev) => prev + emoji);
                          setIsEmojiPickerOpen(false);
                          textareaRef.current?.focus();
                        }}
                        style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", padding: "4px" }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
