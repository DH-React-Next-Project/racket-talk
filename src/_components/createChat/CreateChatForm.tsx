"use client";

import calendar from "@/assets/createChat/calendar.svg";
import location from "@/assets/createChat/location.svg";
import memo from "@/assets/createChat/memo.svg";
import Image from "next/image";

const CreateChatForm = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-5 w-full">
      <div className="flex flex-col gap-5 border-[2px] border-main rounded-md p-2 w-full">
        <div className="flex gap-2">
          <Image src={location} width={21} height={26} alt="location" />
          <p className="font-semibold text-lg">보라매공원 테니스장 1번 코트</p>
        </div>
        <p className="ml-7">서울특별시 동작구 신대방제2동</p>
      </div>

      <div className="flex flex-col gap-5 border-[2px] border-main rounded-md p-2 w-full">
        <div className="flex gap-2">
          <Image src={calendar} width={21} height={26} alt="calendar" />
          <p className="font-semibold text-lg">날짜 및 시간</p>
        </div>
        <p className="ml-7">서울특별시 동작구 신대방제2동</p>
      </div>

      <div className="flex flex-col gap-5 border-[2px] border-main rounded-md p-2 w-full">
        <div className="flex gap-2">
          <Image src={memo} width={21} height={26} alt="memo" />
          <p className="font-semibold text-lg">메모</p>
        </div>
        <p className="ml-7">서울특별시 동작구 신대방제2동</p>
      </div>

      <div className="flex gap-5 w-full">
        <button className="bg-main rounded-md text-white font-semibold w-1/2 h-12">
          만들기
        </button>
        <button className="bg-main rounded-md text-white font-semibold w-1/2 h-12">
          취소하기
        </button>
      </div>
    </div>
  );
};

export default CreateChatForm;
