import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, nickname } = body;

    if (!email || !password || !nickname) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use." },
        { status: 409 }
      );
    }

    const newUser = await prisma.user.create({
      data: { email, password, nickname },
    });

    return NextResponse.json(
      { message: "User created.", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Join error: ", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
