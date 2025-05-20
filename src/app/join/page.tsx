"use client";

import Image from "next/image";
import logo from "@/assets/join/logo-without-text.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  email: string;
  password: string;
  nickname: string;
  passwordConfirm: string;
};

const JoinPage = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    nickname: "",
    passwordConfirm: "",
  });

  const onSubmit = async () => {
    if (form.password !== form.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (form.nickname.length < 2) {
      alert("닉네임은 두 글자 이상으로 작성해 주세요.");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{10,}$/;

    if (!passwordRegex.test(form.password)) {
      alert(
        "비밀번호는 10자 이상이며, 영문/숫자/특수기호를 모두 포함해야 합니다."
      );
      return;
    }

    try {
      const res = await fetch("/api/user/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          nickname: form.nickname,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "서버 응답이 올바르지 않습니다." };
      }

      if (!res.ok) {
        alert(`회원가입 실패: ${data.message}`);
      } else {
        alert("회원가입 성공! 로그인 화면으로 이동합니다.");
        router.push("/login");
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
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border-2 border-main p-2 rounded-md w-full focus:border-charcoal focus:outline-none"
        />
        <input
          placeholder="Nickname"
          value={form.nickname}
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
          className="border-2 border-main p-2 rounded-md w-full focus:border-charcoal focus:outline-none"
        />
        <input
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          type="password"
          className="border-2 border-main p-2 rounded-md w-full focus:border-charcoal focus:outline-none"
        />
        <input
          placeholder="Password Confirm"
          value={form.passwordConfirm}
          onChange={(e) =>
            setForm({ ...form, passwordConfirm: e.target.value })
          }
          type="password"
          className="border-2 border-main p-2 rounded-md w-full focus:border-charcoal focus:outline-none"
        />
        <button
          onClick={onSubmit}
          className="bg-main bg-opacity-25 rounded-md p-3 text-white"
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default JoinPage;
