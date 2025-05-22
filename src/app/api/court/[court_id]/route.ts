import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

/**
 * GET /api/courts/[court_id]
 *
 * @param req      — Next.js Request 객체 (사용하지 않아도 인자로 받아야 함)
 * @param context  — 동적 세그먼트 파라미터 { params: { court_id: string } }
 *
 * 반환: 코트 1건 (+ 상세 배열 포함) ⇢ JSON
 */
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