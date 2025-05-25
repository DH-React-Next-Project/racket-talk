import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
  try {
    const { room_name, memo, court_detail_id, user_id } = await req.json();

    // 1. 채팅방 생성
    const newRoom = await prisma.chat_room.create({
      data: {
        room_name,
        memo,
        court_detail_id,
      },
    });

    // 2. 생성자를 참가자로 등록
    await prisma.chat_room_participant.create({
      data: {
        user_id,
        room_id: newRoom.room_id,
        joined_at: new Date(),
      },
    });

    return NextResponse.json({ room_id: newRoom.room_id }, { status: 201 });
  } catch (error) {
    console.error("❌ 채팅방 생성 실패:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
