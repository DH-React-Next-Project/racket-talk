import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function GET() {
    try {
        const courts = await prisma.courts.findMany({
            select: {
                court_id: true,
                court_name: true,
                lat: true,
                lng: true,
            },
        });

        return NextResponse.json(courts);
    } catch (error) {
        console.error("❌ Failed to fetch courts:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}