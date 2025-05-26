import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { room_name, memo, court_detail_id } = body;

    // 1. 로그인한 사용자 식별
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. 필드 유효성 검사
    if (!court_detail_id) {
      return NextResponse.json(
        { error: "court_detail_id is required" },
        { status: 400 }
      );
    }

    // 3. 채팅룸 생성
    const newRoom = await prisma.chat_room.create({
      data: {
        room_name,
        memo,
        court_detail_id,
      },
    });

    // 4. 현재 유저를 자동으로 참가자로 등록
    await prisma.chat_room_participant.create({
      data: {
        user_id: Number(userId),
        room_id: newRoom.room_id,
        joined_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, room: newRoom });
  } catch (error) {
    console.error("Error creating chat room:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
