"use client";

import Image from "next/image";
import profile from "@/assets/my/solar_tennis-bold.svg";
import starFilled from "@/assets/my/Property 1=mdi_star.svg";
import starOutline from "@/assets/my/Property 1=mdi_star-outline.svg";
import MyPageButton from "@/_components/my/MyPageButton";
import courtImage from "@/assets/my/sample.svg";

import LogoutModal from "@/_components/my/logoutModal";
import { useState } from "react";

{/* 더미 데이터 */ }
const mockFavorites = [
  {
    id: 1,
    name: "보라매 공원 테니스장",
    address: "서울특별시 동작구 신대방제2동",
    imageUrl: "/assets/my/image 5.svg",
    isFavorite: true,
  },
  {
    id: 2,
    name: "한강시민공원 테니스장",
    address: "서울특별시 마포구 상암동",
    imageUrl: "/assets/my/image 5.svg",
    isFavorite: false,
  },
  {
    id: 3,
    name: "한강시민공원 테니스장",
    address: "서울특별시 마포구 상암동",
    imageUrl: "/assets/my/image 5.svg",
    isFavorite: false,
  },
  {
    id: 4,
    name: "한강시민공원 테니스장",
    address: "서울특별시 마포구 상암동",
    imageUrl: "/assets/my/image 5.svg",
    isFavorite: false,
  },
  {
    id: 5,
    name: "한강시민공원 테니스장",
    address: "서울특별시 마포구 상암동",
    imageUrl: "/assets/my/image 5.svg",
    isFavorite: false,
  },
  {
    id: 6,
    name: "한강시민공원 테니스장",
    address: "서울특별시 마포구 상암동",
    imageUrl: "/assets/my/image 5.svg",
    isFavorite: false,
  },
  {
    id: 7,
    name: "한강시민공원 테니스장",
    address: "서울특별시 마포구 상암동",
    imageUrl: "/assets/my/image 5.svg",
    isFavorite: false,
  },
  {
    id: 8,
    name: "한강시민공원 테니스장",
    address: "서울특별시 마포구 상암동",
    imageUrl: "/assets/my/image 5.svg",
    isFavorite: false,
  },
];

const MyPage = () => {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [showModal, setShowModal] = useState(false);
  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    console.log("로그아웃 진행");
    setShowModal(false);
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.map((court) =>
        court.id === id ? { ...court, isFavorite: !court.isFavorite } : court
      )
    );
  };

  return (
    <>
      <div className="bg-main text-white text-center py-4 text-xl font-bold">
        Racket Talk
      </div>

      <div className="bg-[#F6F6F6] w-[336px] h-[136px] rounded-[10px] mx-auto flex flex-col justify-between px-4 py-2">
        <div className="flex mt-2">
          <div className="flex items-center justify-center mr-4">
            <Image src={profile} alt="profile" width={50} height={50} />
          </div>
          <div className="mt-2">
            <div className="text-[var(--color-charcoal)] font-semibold">유저 님</div>
            <div className="text-[var(--color-lightGray)]">test@naver.com</div>
          </div>
        </div>

        <div className="flex justify-center">
          <MyPageButton text="로그아웃" onClick={() => setShowModal(true)} />

          {showModal && (
            <LogoutModal
              onConfirm={() => {
                setShowModal(false);
                console.log("로그아웃");
              }}
              onCancel={() => setShowModal(false)}
            />
          )}
          <MyPageButton text="회원탈퇴" />
        </div>
      </div>

      <div className="flex items-baseline px-4 mt-6 mb-2">
        <span className="text-lg font-semibold mr-2">즐겨찾기한 테니스장</span>
        <span className="text-sm text-gray-500">총 {favorites.length}개</span>
      </div>

      {/* 즐겨찾기한 테니스장 리스트 */}
      <div className="max-h-[623px] overflow-y-scroll">
        {favorites.map((court) => (
          <div
            key={court.id}
            className="flex justify-between items-center px-4 py-3 border-b"
          >
            <div className="flex items-center">
              <Image
                src={courtImage}
                alt="테니스장"
                className="w-[60px] h-[60px] rounded-md mr-4 object-cover"
              />
              <div>
                <div className="font-semibold text-[15px]">{court.name}</div>
                <div className="text-gray-500 text-sm">{court.address}</div>
              </div>
            </div>

            <Image
              src={court.isFavorite ? starFilled : starOutline}
              alt="즐겨찾기"
              width={24}
              height={24}
              onClick={() => toggleFavorite(court.id)}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default MyPage;