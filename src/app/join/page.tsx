"use client";

import Image from "next/image";
import logo from "@/assets/join/logo-without-text.svg";

const JoinPage = () => {
  return (
    <div className="flex flex-col">
      <Image src={logo} alt="logo" />
    </div>
  );
};

export default JoinPage;
