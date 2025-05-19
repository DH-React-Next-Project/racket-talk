"use client";

import Image from "next/image";
import logo from "@/assets/header/logo.svg";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-20 border-b-[2px] border-main">
      <Image
        src={logo}
        alt="로고"
        width={130}
        height={130}
        onClick={() => router.push("/map")}
        className="relative top-4"
      />
    </div>
  );
};

export default Header;
