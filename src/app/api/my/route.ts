import { cookies } from "next/headers";
import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

// 유저 정보 + 즐겨찾기 코트 목록 조회
export async function GET() {
  try {
    const cookieStore = cookies();
    const user_id = Number(cookieStore.get("user_id")?.value);

    if (!user_id) {
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
      where: { user_id: user_id },
      include: { court: true },
    });

    const formattedFavorites = favorites.map((f) => ({
      court_id: f.court.court_id,
      court_name: f.court.court_name,
      address: f.court.address,
      court_image: f.court.court_image,
      isFavorite: true,
    }));

    return NextResponse.json({
      user,
      favorites: formattedFavorites,
    });
  } catch (error) {
    console.error("❌ Failed to fetch my page data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// 즐겨찾기 추가
export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const user_id = Number(cookieStore.get("user_id")?.value);
  const { court_id } = await req.json();

  if (!user_id || !court_id) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  try {
    const exists = await prisma.favorite.findFirst({
      where: { user_id: user_id, court_id: court_id },
    });

    if (exists) {
      return NextResponse.json({ message: "Already favorited" }, { status: 200 });
    }

    await prisma.favorite.create({
      data: {
        user: { connect: { user_id } },
        court: { connect: { court_id } },
      },
    });

    return NextResponse.json({ message: "Favorite added!" }, { status: 201 });
  } catch (error) {
    console.error("❌ Favorite Add Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// 즐겨찾기 삭제
export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();
  const user_id = Number(cookieStore.get("user_id")?.value);
  const { court_id } = await req.json();

  if (!user_id || !court_id) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  try {
    await prisma.favorite.deleteMany({
      where: {
        user_id: user_id,
        court_id: court_id,
      },
    });

    return NextResponse.json({ message: "Favorite removed!" }, { status: 200 });
  } catch (error) {
    console.error("❌ Favorite Delete Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}