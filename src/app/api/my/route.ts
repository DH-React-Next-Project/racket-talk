import { cookies } from "next/headers";
import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

// 유저 정보 + 즐겨찾기한 코트 목록 조회
export async function GET(req: NextRequest) {
  try {
    const userId = Number(req.cookies.get("user_id")?.value);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        nickname: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { user_id: userId },
      select: { court_id: true },
    });

    const courtIds = favorites
      .map((f) => f.court_id)
      .filter((id): id is number => id !== null);

    const courts = await prisma.court.findMany({
      where: {
        court_id: { in: courtIds },
      },
      select: {
        court_id: true,
        court_name: true,
        address: true,
        court_image: true,
      },
    });

    return NextResponse.json({
      user,
      favorites: courts.map((court) => ({
        ...court,
        isFavorite: true,
      })),
    });
  } catch (error) {
    console.error("❌ GET /api/my Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}