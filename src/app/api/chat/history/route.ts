import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const roomId = Number(searchParams.get("roomId"));

    if (!roomId) {
        return NextResponse.json(
            { error: "roomId is required" },
            { status: 400 }
        );
    }

    try {
        const messages = await prisma.chat_message.findMany({
            where: { room_id: Number(roomId) },
            orderBy: { sent_at: "asc" },
            select: {
                message: true,
                sent_at: true,
                room_id: true,
                user: {
                    select: {
                        nickname: true,
                    },
                },
            },
        });

        return NextResponse.json({
            messages: messages.map((m) => ({
                roomId: m.room_id,
                username: m.user.nickname,
                message: m.message,
                time: m.sent_at,
            })),
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
