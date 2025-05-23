import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function GET(
    req: NextRequest,
    { params }: { params: { court_id: string } }
) {
    const userId = Number(req.cookies.get("user_id")?.value);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courtId = Number(params.court_id);
    if (!courtId || Number.isNaN(courtId)) {
        return NextResponse.json(
            { error: "Court ID is missing or invalid" },
            { status: 400 }
        );
    }

    try {
        const data = await prisma.favorite.findFirst({ where: { user_id: userId, court_id: courtId } });
        if (!data) {
            return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("Error fetching court data:", err);
        return NextResponse.json(
            { error: "Failed to fetch court data" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { court_id: string } }
) {
    const userId = Number(req.cookies.get("user_id")?.value);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courtId = Number(params.court_id);
    if (!courtId || Number.isNaN(courtId)) {
        return NextResponse.json(
            { error: "Court ID is missing or invalid" },
            { status: 400 }
        );
    }

    const { favorite_memo } = await req.json();

    try {
        const created = await prisma.favorite.create({
            data: {
                user_id: userId,
                court_id: courtId,
                favorite_memo,
            },
        });

        return NextResponse.json(created, { status: 201 });
    } catch (err) {
        console.error("Error create favorite:", err);
        return NextResponse.json(
            { error: "Failed to create favorite" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { court_id: string } }
) {
    const userId = Number(req.cookies.get("user_id")?.value);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courtId = Number(params.court_id);
    if (!courtId || Number.isNaN(courtId)) {
        return NextResponse.json(
            { error: "Court ID is missing or invalid" },
            { status: 400 }
        );
    }

    const { favorite_memo } = await req.json();

    try {
        const updated = await prisma.favorite.updateMany({
            where: { user_id: userId, court_id: courtId },
            data: { favorite_memo },
        });

        if (updated.count === 0) {
            return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Favorite memo updated!" });
    } catch (err) {
        console.error("Error updating favorite:", err);
        return NextResponse.json(
            { error: "Failed to update favorite" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest,
    { params }: { params: { court_id: string } }
) {
    const userId = Number(req.cookies.get("user_id")?.value);
    const courtId = Number(params.court_id);

    if (!userId || Number.isNaN(courtId)) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    try {
        await prisma.favorite.deleteMany({
            where: { user_id: userId, court_id: courtId },
        });
        return NextResponse.json({ message: "Favorite deleted!" }, { status: 200 });
    } catch (err) {
        console.error("Error delete favorite:", err);
        return NextResponse.json(
            { error: "Failed to create favorite" },
            { status: 500 }
        );
    }
}