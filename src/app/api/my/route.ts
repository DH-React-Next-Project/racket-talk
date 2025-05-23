import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = Number(req.cookies.get("user_id")?.value);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 유저 정보 조회
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        nickname: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 즐겨찾기 court_id + memo
    const favoritesRaw = await prisma.favorite.findMany({
      where: { user_id: userId },
      select: {
        court_id: true,
      },
    });

    // court 상세 정보
    const courtIds: number[] = favoritesRaw
      .map((f) => f.court_id)
      .filter((id): id is number => id !== null);

    const courts = await prisma.court.findMany({
      where: {
        court_id: { in: courtIds, },
      },
      select: {
        court_id: true,
        court_name: true,
        address: true,
        court_image: true,
      },
    });

    // court
    const favorites = courts.map((court) => {
      return {
        ...court,
        isFavorite: true,
      };
    });

    return NextResponse.json({ user, favorites });
  } catch (error) {
    console.error("❌ GET /api/my Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}