"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import mapIcon from "@/assets/layouts/map-icon.svg";
import selectedMapIcon from "@/assets/layouts/selected-map-icon.svg";
import chatIcon from "@/assets/layouts/chat-icon.svg";
import selectedChatIcon from "@/assets/layouts/selected-chat-icon.svg";
import myIcon from "@/assets/layouts/my-icon.svg";
import selectedMyIcon from "@/assets/layouts/selected-my-icon.svg";

const BottomTab = () => {
  const pathname = usePathname();

  const hideTabRoutes = ["/login", "/join", "/"];
  const shouldHide = hideTabRoutes.includes(pathname);

  if (shouldHide) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-white">
      <div className="h-24 w-full max-w-[600px] flex items-center justify-around">
        <Link href="/map">
          <div className="flex flex-col justify-center items-center">
            <Image
              src={pathname === "/map" ? selectedMapIcon : mapIcon}
              width={21.29}
              height={25.91}
              alt="지도 아이콘"
            />
            <p
              className={`font-medium text-sm mt-[7.09px] ${
                pathname === "/map" ? "text-black" : "text-lightGray"
              }`}
            >
              지도
            </p>
          </div>
        </Link>
        <Link href="/chat">
          <div className="flex flex-col justify-center items-center">
            <Image
              src={pathname === "/chat" ? selectedChatIcon : chatIcon}
              width={25}
              height={22}
              alt="채팅 아이콘"
            />
            <p
              className={`font-medium text-sm mt-[11.18px] ${
                pathname === "/chat" ? "text-black" : "text-lightGray"
              }`}
            >
              채팅
            </p>
          </div>
        </Link>
        <Link href="/my">
          <div className="flex flex-col justify-center items-center">
            <Image
              src={pathname === "/my" ? selectedMyIcon : myIcon}
              width={22}
              height={22}
              alt="프로필 아이콘"
            />
            <p
              className={`font-medium text-sm mt-[12px] ${
                pathname === "/my" ? "text-black" : "text-lightGray"
              }`}
            >
              마이페이지
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BottomTab;
