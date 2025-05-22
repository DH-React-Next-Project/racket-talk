import { cookies } from "next/headers";
import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

// 유저 정보 + 즐겨찾기한 코트 목록 조회
export async function GET() {
  try {
    const cookieStore = cookies();
    const userIdRaw = cookieStore.get("user_id")?.value;
    const user_id = userIdRaw ? Number(userIdRaw) : null;

    if (!user_id || isNaN(user_id)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { user_id },
      select: {
        nickname: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { user_id },
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

// 즐겨찾기 추가
export async function POST(req: NextRequest) {
  try {
    const userIdRaw = cookies().get("user_id")?.value;
    const user_id = userIdRaw ? Number(userIdRaw) : null;

    const { court_id } = await req.json();

    if (!user_id || isNaN(user_id) || !court_id) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    const exists = await prisma.favorite.findFirst({
      where: { user_id, court_id },
    });

    if (exists) {
      return NextResponse.json({ message: "Already favorited" }, { status: 200 });
    }

    await prisma.favorite.create({
      data: { user_id, court_id },
    });

    return NextResponse.json({ message: "Favorite added!" }, { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/my Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// 즐겨찾기 삭제
export async function DELETE(req: NextRequest) {
  try {
    const userIdRaw = cookies().get("user_id")?.value;
    const user_id = userIdRaw ? Number(userIdRaw) : null;

    const { court_id } = await req.json();

    if (!user_id || isNaN(user_id) || !court_id) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: { user_id, court_id },
    });

    return NextResponse.json({ message: "Favorite removed!" }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE /api/my Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}