// src/app/api/court-detail/[court_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

type Context = {
    // Next 15: params 는 Promise!
    params: Promise<{ court_id: string }>;
};

export async function GET(_req: NextRequest, { params }: Context) {
    const { court_id } = await params;          // 반드시 await
    const id = Number(court_id);

    if (!id || Number.isNaN(id)) {
        return NextResponse.json({ error: "invalid court_id" }, { status: 400 });
    }

    /** 같은 court_id 를 가진 모든 상세 레코드 */
    const details = await prisma.courtDetail.findMany({
        where: { court_id: id },
        include: {
            court: true,        // ← court_name·address·telno·image도 함께 가져옴
        },
    });

    /** court.* 필드를 평평하게 펴서 반환 */
    const flattened = details.map((d) => ({
        ...d,
        ...d.court,           // court_name, address, telno, court_image
    }));

    return NextResponse.json(flattened);
}
