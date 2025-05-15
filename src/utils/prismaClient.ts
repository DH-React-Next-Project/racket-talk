import { PrismaClient } from "@prisma/client";

// 매번 새로운 인스턴스를 만들지 않도록 전역 객체로 관리
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 데이터베이스 연결을 관리하는 Prisma Client 중복 선언 방지용 코드
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["query"] });
