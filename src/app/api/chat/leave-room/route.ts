import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
    try {
        const cookieStore = await cookies();
        const clientId = cookieStore.get("user_id")?.value;
        const { searchParams } = new URL(req.url);
        const roomId = Number(searchParams.get("roomId"));

        if (!clientId || !roomId) {
            return NextResponse.json(
                { success: false, error: "Missing parameters" },
                { status: 400 }
            );
        }

        await prisma.chat_room_participant.delete({
            where: {
                user_id_room_id: {
                    user_id: Number(clientId),
                    room_id: roomId,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("방 나가기 오류:", error);
        return NextResponse.json(
            { success: false, error: "삭제 실패" },
            { status: 500 }
        );
    }
}
