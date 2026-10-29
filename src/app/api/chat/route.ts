import { NextResponse } from "next/server";
import { INITIAL_CHAT_ROOMS, COMMUNITY_MEMBERS, INITIAL_MESSAGES } from "@/utils/chatStorage";
import { ChatMessage } from "@/types/chat";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId");

  if (roomId) {
    const messages = INITIAL_MESSAGES[roomId] || [];
    return NextResponse.json({
      roomId,
      messages,
    });
  }

  return NextResponse.json({
    rooms: INITIAL_CHAT_ROOMS,
    members: COMMUNITY_MEMBERS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "send_message") {
      const { roomId, content, senderId, senderName, senderRole, senderTitle, attachmentName, attachmentType } = body;

      if (!roomId || !content?.trim()) {
        return NextResponse.json({ error: "Room ID and message content are required." }, { status: 400 });
      }

      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        roomId,
        senderId: senderId || "guest-user",
        senderName: senderName || "Guest User",
        senderRole: senderRole || "buyer",
        senderTitle: senderTitle || "SaaS Explorer",
        content: content.trim(),
        timestamp: new Date().toISOString(),
        attachmentName,
        attachmentType,
        reactions: [],
      };

      return NextResponse.json({ success: true, message: newMessage });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process chat request." },
      { status: 500 }
    );
  }
}

