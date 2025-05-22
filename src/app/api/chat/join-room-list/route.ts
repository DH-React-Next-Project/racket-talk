import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function GET(req: NextRequest) {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const courtChats: RawData[] = await prisma.$queryRaw`
            SELECT DISTINCT ON (r.room_id)
                p.user_id,
                r.room_id,
                r.room_name,
                r.memo,
                cd.detail_court_name,
                c.court_name,
                m.message
            FROM chat_room_participant p
                JOIN chat_room r ON p.room_id = r.room_id
                JOIN court_detail cd ON r.court_detail_id = cd.court_detail_id
                JOIN court c ON cd.court_id = c.court_id
                LEFT JOIN chat_message m ON m.room_id = r.room_id
            WHERE p.user_id = ${Number(userId)}
            ORDER BY r.room_id, m.sent_at DESC;
        `;
        const sendData: CourtChats[] = [];
        courtChats.forEach((room: RawData) => {
            const courtName = room.court_name;
            const roomData: Room = {
                roomId: room.room_id,
                courtDetailName: room.detail_court_name,
                roomName: room.room_name,
                message: room.message ? room.message : "메세지가 없습니다.",
                memo: room.memo,
            };
            const courtIndex = sendData.findIndex(
                (court) => court.courtName === courtName
            );
            if (courtIndex === -1) {
                sendData.push({
                    courtName: courtName,
                    rooms: [roomData],
                });
            } else {
                sendData[courtIndex].rooms.push(roomData);
            }
        });
        return NextResponse.json({ data: sendData });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
type RawData = {
    user_id: number;
    room_id: number;
    room_name: string;
    memo: string;
    detail_court_name: string;
    court_name: string;
    message: string;
};
