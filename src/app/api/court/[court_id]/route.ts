import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

type Context = {
    // Next 15: params 는 Promise!
    params: Promise<{ court_id: string }>;
};

export async function GET(
    req: Request,
    { params }: { params: { court_id: string } }
) {
    try {
        const courtId = Number(params.court_id);

        // court_id 유효성 확인
        if (!courtId || Number.isNaN(courtId)) {
            return NextResponse.json(
                { error: "Court ID is missing or invalid" },
                { status: 400 }
            );
        }

        /** Court 1건 + 상세 리스트(details) */
        const court = await prisma.court.findUnique({
            where: { court_id: courtId },
            select: {
                court_name: true,
                address: true,
                court_image: true,
                telno: true,
                lng: true,
                lat: true,
            },
        });

        if (!court) {
            return NextResponse.json({ error: "Court not found" }, { status: 404 });
        }

        // telno가 null이면 "정보 없음"을 추가
        const processedCourt = {
            ...court,
            telno: court.telno ?? "정보 없음",
        };

        return NextResponse.json(processedCourt);
    } catch (err) {
        console.error("Error fetching court data:", err);
        return NextResponse.json(
            { error: "Failed to fetch court data" },
            { status: 500 }
        );
    }
}