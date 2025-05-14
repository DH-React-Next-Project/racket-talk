"use client";

import { useRouter } from "next/navigation";

const LandingBtn = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col max-w-[600px] fixed bottom-4 inset-x-10 mx-auto text-white gap-3">
      <button
        className="bg-main w-full rounded-md h-10 cursor-pointer"
        onClick={() => router.push("/login")}
      >
        Login
      </button>
      <button
        className="bg-main w-full rounded-md h-10 cursor-pointer"
        onClick={() => router.push("/join")}
      >
        Join
      </button>
    </div>
  );
};

export default LandingBtn;
