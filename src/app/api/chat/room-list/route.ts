import { NextRequest } from "next/server";
import { prisma } from "@/utils/prismaClient";

type UserId = {
    user_id: number;
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const courtId = Number(searchParams.get("courtId"));
    const courtDetailId = searchParams.get("courtDetailId");
    if (!courtId || !courtDetailId) {
        return new Response(
            JSON.stringify({ error: "courtId and courtDetailId are required" }),
            {
                status: 400,
            }
        );
    }

    const userId = req.cookies.get("user_id")?.value;
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const isJoined = (users: UserId[]) => {
        return users.some((user) => user.user_id === Number(userId));
    };

    try {
        let roomList;
        if (courtDetailId === "all") {
            roomList = await prisma.chat_room.findMany({
                where: {
                    court_detail: {
                        court_id: courtId,
                    },
                },
                include: {
                    court_detail: {
                        select: {
                            detail_court_name: true,
                        },
                    },
                    chat_room_participant: {
                        select: {
                            user_id: true,
                        },
                    },
                },
            });
        } else {
            roomList = await prisma.chat_room.findMany({
                where: {
                    court_detail_id: courtDetailId,
                },
                include: {
                    court_detail: {
                        select: {
                            detail_court_name: true,
                        },
                    },
                    chat_room_participant: {
                        select: {
                            user_id: true,
                        },
                    },
                },
            });
        }
        const data: CourtChatRoom[] = roomList.map((room) => ({
            roomId: room.room_id,
            roomName: room.room_name,
            memo: room.memo,
            courtDetailName: room.court_detail.detail_court_name,
            isJoined: isJoined(room.chat_room_participant),
        }));
        const groupedByCourtDetail: Record<string, CourtChatRoom[]> =
            data.reduce((acc, room) => {
                const courtName = room.courtDetailName;
                if (!acc[courtName]) {
                    acc[courtName] = [];
                }
                acc[courtName].push(room);
                return acc;
            }, {} as Record<string, CourtChatRoom[]>);

        return new Response(JSON.stringify({ groupedByCourtDetail }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching chat room list:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
