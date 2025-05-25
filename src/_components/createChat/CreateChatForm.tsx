"use client";

import calendar from "@/assets/createChat/calendar.svg";
import location from "@/assets/createChat/location.svg";
import memo from "@/assets/createChat/memo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";

const CreateChatForm = ({
  data,
  courtDetailData,
}: {
  data: dataProps;
  courtDetailData: any;
}) => {
  const router = useRouter();
  const date = new Date();
  const [form, setForm] = useState<FormState>({
    time: date,
    memo: "",
    detailCourtId: courtDetailData?.[0]?.detail_court_id ?? "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, detailCourtId: event.target.value });
  };

  const onSubmit = async () => {
    if (!form.detailCourtId) {
      alert("테니스장을 선택해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/chat/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          court_detail_id: form.detailCourtId,
          memo: form.memo,
          time: form.time.toISOString(), // ISO 문자열로 전송
        }),
      });

      const result = await response.json();

      if (response.ok && result?.room?.room_id) {
        // 채팅방 상세 페이지 등으로 이동
        router.push(`/chat-room/${result.room.room_id}`);
      } else {
        alert("채팅방 생성에 실패했습니다.");
        console.error(result);
      }
    } catch (error) {
      console.error("API 요청 중 오류:", error);
      alert("문제가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full p-5 mt-20">
      <div className="flex flex-col gap-5 border-[2px] border-main rounded-md p-2 w-full">
        <div className="flex gap-2">
          <Image src={location} width={21} height={26} alt="location" />
          <p className="font-semibold text-lg">{data.court_name}</p>
        </div>
        <p className="ml-7">{data.address}</p>
        <div className="flex flex-col ml-7 w-fit">
          <label className="font-semibold text-lg mb-3">
            테니스장을 선택하세요.
          </label>
          <select
            id="court"
            value={form.detailCourtId}
            onChange={handleChange}
            className="border-[2px] border-main px-3 py-2 rounded focus:outline-none focus:ring-0 focus:border-main"
          >
            <option value="">상세 테니스장을 선택하세요.</option>
            {courtDetailData.map((item: any) => (
              <>
                <option key={item.detail_court_id} value={item.court_detail_id}>
                  {item.detail_court_name}
                </option>
              </>
            ))}
          </select>
        </div>
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
        <button
          onClick={onSubmit}
          className="bg-main rounded-md text-white font-semibold w-1/2 h-12"
        >
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
