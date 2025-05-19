import type { Metadata } from "next";

import "@/styles/globals.css";
import "@/styles/tailwind.css";

import BottomTab from "@/_components/layouts/BottomTab";

export const metadata: Metadata = {
  title: "Racket Talk",
  description: "테니스를 더 쉽게! 지도 기반 테니스 메이트 매칭 플랫폼, 라켓톡",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <BottomTab />
      </body>
    </html>
  );
}
