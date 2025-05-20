import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function GET(req: Request, { params }: { params: { court_id: string } }) {
  try {
    const { court_id } = params;

    // court_id가 숫자인지 확인
    if (!court_id) {
      return NextResponse.json({ error: "Court ID is missing" }, { status: 400 });
    }

    const court = await prisma.courts.findUnique({ // courts 또는 court로 수정
      where: { court_id: Number(court_id) },
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

    return NextResponse.json(court);
  } catch (error) {
    console.error("Error fetching court data:", error);
    return NextResponse.json(
      { error: "Failed to fetch court data" },
      { status: 500 }
    );
  }
}