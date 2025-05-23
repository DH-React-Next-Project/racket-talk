import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/prismaClient";

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
        console.log(data)
        return NextResponse.json(data);
    } catch(err) {
        console.error("Error fetching court data:", err);
        return NextResponse.json(
            { error: "Failed to fetch court data" },
            { status: 500 }
        );
    }
}
