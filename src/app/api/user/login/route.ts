import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // 이메일을 매개로 동일한 이메일 항목을 가지고 있는 행을 찾기
    const user = await prisma.user.findUnique({ where: { email } });

    // 동일한 이메일을 가진 행이 없거나, 있지만 입력한 패스워드와 다를 경우 401 에러를 반환
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 로그인 성공
    return NextResponse.json(
      { message: "Login Successful!", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
