"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import marker from "@/assets/courts/map-marker.svg";
import phoneIcon from "@/assets/courts/phone.svg";
import FavoriteToggle from "@/_components/courts/ToggleFavorite";

const CourtsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courtData, setCourtData] = useState<any>(null); // Court 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 모달 토글 핸들러
  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchCourtData = async () => {
      try {
        const response = await fetch("/api/courts/1"); // 예: ID가 1인 테니스장 데이터
        if (!response.ok) {
          throw new Error("Failed to fetch court data");
        }
        const data = await response.json();
        setCourtData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourtData();
  }, []);

  // 로딩 중
  if (loading) {
    return <div>Loading...</div>;
  }

  // 데이터가 없는 경우
  if (!courtData) {
    return <div>Error: No court data available</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h3 className="text-2xl font-bold text-center">지도 화면</h3>
      <button
        onClick={handleModalToggle}
        className="bg-main text-white font-medium rounded-md px-4 py-2 text-lg transition"
      >
        테니스장 상세
      </button>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-76.25 h-64.25 max-w-md shadow-lg z-60 space-y-4">
            {/* 모달 헤더 */}
            <div className="flex items-center gap-2">
              <Image src={marker} alt="logo" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-[15px] text-gray-900 text-lg font-bold">
                  {courtData.name} {/* court_name */}
                </span>
                <span className="text-[8px]">{courtData.address}</span> {/* address */}
              </div>
              <FavoriteToggle />
            </div>

            {/* 모달 바디 */}
            <div className="flex gap-4 items-start">
              {/* 왼쪽 이미지 */}
              <img
                src={courtData.image}
                alt={`${courtData.name} 이미지`}
                className="rounded-md object-cover w-29.75 h-29.75"
              />

              {/* 오른쪽 콘텐츠 */}
              <div className="flex flex-col gap-3">
                {/* 전화번호 */}
                <div className="flex items-center gap-1">
                  <Image src={phoneIcon} alt="phone" width={10} height={11} />
                  <div className="text-black w-29.75">
                    <b className="text-[10px]">전화번호</b>{" "}
                    <a className="text-[8px]">{courtData.phone}</a> {/* telno */}
                  </div>
                </div>
                <button className="bg-main text-white rounded-md px-4 py-2 text-xs transition">
                  채팅방 리스트 보기
                </button>
                <button className="bg-main text-white rounded-md px-4 py-2 text-xs transition">
                  채팅방 생성하기
                </button>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="mt-6 flex justify-end">
              <button className="text-gray-400 text-[9px] text-semibold">
                상세정보 {">"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CourtsPage;