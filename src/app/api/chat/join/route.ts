import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";


export async function POST(req: NextRequest) {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { roomId } = await req.json();

        if (!roomId) {
            return NextResponse.json({ error: "roomId is required" }, { status: 400 });
        }

        await prisma.chat_room_participant.create({
            data: {
                user_id: Number(userId),
                room_id: Number(roomId),
                joined_at: new Date(),
            },
        });

        return NextResponse.json({ message: "Successfully joined chat room" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to join chat room" }, { status: 500 });
    }
}
