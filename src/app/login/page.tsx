"use client";

import Image from "next/image";
import logo from "@/assets/join/logo-without-text.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginState = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState<LoginState>({
    email: "",
    password: "",
  });

  const onSubmit = async () => {
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        alert(
          `로그인에 실패하였습니다. 이메일 및 패스워드를 다시 한번 확인해 주세요.`
        );
      } else {
        alert("로그인 성공!");
        router.push("/map");
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col p-5 min-h-screen justify-center items-center">
      {/* 회원가입 가이드 */}
      <div className="flex gap-4 w-full px-5">
        <Image src={logo} alt="logo" width={80} height={80} />
        <div className="flex flex-col">
          <p className="text-3xl font-bold">LOGIN</p>
          <p className="text-lg">이메일과 패스워드를 입력해 주세요.</p>
        </div>
      </div>

      {/* 정보 입력창 */}
      <div className="w-full p-5 flex flex-col gap-2">
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border-2 border-main p-2 rounded-md w-full focus:border-charcoal focus:outline-none"
        />
        <input
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          type="password"
          className="border-2 border-main p-2 rounded-md w-full focus:border-charcoal focus:outline-none"
        />
        <button
          onClick={onSubmit}
          className="bg-main bg-opacity-25 rounded-md p-3 text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
