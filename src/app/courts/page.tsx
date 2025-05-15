"use client";

import {useState} from "react";
import Image from "next/image";
import marker from "@/assets/courts/map-marker.svg";
import phone from "@/assets/courts/phone.svg";
import FavoriteToggle from "@/_components/toggleFavorite";

const CourtPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalToggle = () => {
        setIsModalOpen((prev) => !prev);
    };

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
                            <Image src={marker} alt="logo" width={20} height={20}/>
                            <div className="flex flex-col">
                                <span className="text-[15px] text-gray-900 text-lg font-bold">난우공원 테니스장</span>
                                <span className="text-[8px]">서울특별시 동작구 신대방제2동</span>
                            </div>
                            <FavoriteToggle />
                        </div>

                        {/* 모달 바디 */}
                        <div className="flex gap-4 items-start">
                            {/* 왼쪽 이미지 */}
                            <img
                                src="https://yeyak.seoul.go.kr/web/common/file/FileDown.do?file_id=17443566570495LT3IT6EAOGUE6S47E9GWEEOQ"
                                alt="테니스장 이미지"
                                className="rounded-md object-cover w-29.75 h-29.75"
                            />

                            {/* 오른쪽 콘텐츠 */}
                            <div className="flex flex-col gap-3">
                                {/* 전화번호 */}
                                <div className="flex items-center gap-1">
                                    <Image src={phone} alt="phone" width={10} height={11}/>
                                    <div className=" text-black w-29.75">
                                        <b className="text-[10px]">전화번호</b> <a className="text-[8px]">02-1234-5678</a>
                                    </div>
                                </div>
                                {/* 채팅방 리스트 보기 버튼 */}
                                <button
                                    className="bg-main text-white rounded-md px-4 py-2 text-xs  transition">
                                    채팅방 리스트 보기
                                </button>
                                {/* 채팅방 생성하기 버튼 */}
                                <button
                                    className="bg-main text-white rounded-md px-4 py-2 text-xs transition">
                                    채팅방 생성하기
                                </button>
                            </div>
                        </div>

                        {/* 모달 푸터 */}
                        <div className="mt-6 flex justify-end">
                            <button className="text-gray-400 text-[9px] text-semibold"> 상세정보 {">"} </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CourtPage;