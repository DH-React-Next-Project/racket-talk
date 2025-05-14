"use client";

import Image from "next/image";
import logo from "@/assets/join/logo-without-text.svg";

const JoinPage = () => {
  return (
    <div className="flex flex-col p-5 min-h-screen justify-center items-center">
      {/* 회원가입 가이드 */}
      <div className="flex gap-4 w-full px-5">
        <Image src={logo} alt="logo" width={80} height={80} />
        <div className="flex flex-col">
          <p className="text-3xl font-bold">JOIN</p>
          <p className="text-lg">
            닉네임은 2자 이상 <br />
            패스워드는 10자 이상 영문, 숫자, 특수기호를 포함해 주세요.
          </p>
        </div>
      </div>

      {/* 정보 입력창 */}
      <div className="w-full p-5 flex flex-col gap-2">
        <input
          placeholder="Email"
          className="border-2 border-main p-2 rounded-md w-full focus:border-charcoal focus:outline-none"
        />
        <input
          placeholder="Nickname"
          className="border-2 border-main p-2 rounded-md w-full focus:border-charcoal focus:outline-none"
        />
        <input
          placeholder="Password"
          type="password"
          className="border-2 border-main p-2 rounded-md w-full focus:border-charcoal focus:outline-none"
        />
        <input
          placeholder="Password Confirm"
          type="password"
          className="border-2 border-main p-2 rounded-md w-full focus:border-charcoal focus:outline-none"
        />
        <button className="bg-main rounded-md p-3 text-white">Join</button>
      </div>
    </div>
  );
};

export default JoinPage;
