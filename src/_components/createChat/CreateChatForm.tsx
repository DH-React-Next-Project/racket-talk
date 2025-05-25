"use client";

import calendar from "@/assets/createChat/calendar.svg";
import location from "@/assets/createChat/location.svg";
import memo from "@/assets/createChat/memo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";

type dataProps = {
  address: string;
  court_image: string;
  court_name: string;
  lat: string;
  lng: string;
  telno: string;
};

type FormState = {
  time: Date;
  memo: string;
};

const CreateChatForm = ({
  data,
  courtDetailData,
}: {
  data: dataProps;
  courtDetailData: any;
}) => {
  const router = useRouter();
  const date = new Date();
  const [form, setForm] = useState<FormState>({ time: date, memo: "" });
  console.log("court detail", courtDetailData);

  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-5 w-full p-5">
      <div className="flex flex-col gap-5 border-[2px] border-main rounded-md p-2 w-full">
        <div className="flex gap-2">
          <Image src={location} width={21} height={26} alt="location" />
          <p className="font-semibold text-lg">{data.court_name}</p>
        </div>
        <p className="ml-7">{data.address}</p>
      </div>

      <div className="flex flex-col gap-5 border-[2px] border-main rounded-md p-2 w-full">
        <div className="flex gap-2 items-center">
          <Image src={calendar} width={21} height={26} alt="calendar" />
          <p className="font-semibold text-lg">날짜 및 시간</p>
        </div>
        <div className="ml-7">
          <DatePicker
            withPortal
            selected={form.time}
            locale={ko}
            onChange={(date: Date) => setForm({ ...form, time: date })}
            showTimeSelect
            dateFormat="yyyy.MM.dd HH:mm"
            className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 border-[2px] border-main rounded-md p-2 w-full">
        <div className="flex gap-2">
          <Image src={memo} width={21} height={26} alt="memo" />
          <p className="font-semibold text-lg">메모</p>
        </div>

        <input
          type="text"
          value={form.memo}
          onChange={(e) => setForm({ ...form, memo: e.target.value })}
          className="ml-7 h-8 p-1 focus:outline-none focus:ring-2 focus:ring-main rounded-md"
          placeholder="메모를 남겨 주세요."
        />
      </div>

      <div className="flex gap-5 w-full">
        <button className="bg-main rounded-md text-white font-semibold w-1/2 h-12">
          만들기
        </button>
        <button
          onClick={() => router.push("/map")}
          className="bg-main rounded-md text-white font-semibold w-1/2 h-12"
        >
          취소하기
        </button>
      </div>
    </div>
  );
};

export default CreateChatForm;
