"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import marker from "@/assets/courts/map-marker.svg";
import phoneIcon from "@/assets/courts/phone.svg";
import FavoriteToggle from "@/_components/court/ToggleFavorite";

type Court = {
    court_name: string;
    address?: string;
    court_image?: string;
    telno?: string;
    lng: number;
    lat: number;
};

export default function CourtsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courtData, setCourtData] = useState<Court | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const courtId = 12;

    useEffect(() => {
        const fetchCourtData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/court/${courtId}`);
                if (!res.ok) throw new Error("Failed to fetch court data");
                const data: Court = await res.json();
                setCourtData(data);
                setError(null);
            } catch (err: any) {
                console.error(err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourtData();
    }, [courtId]);

    /* (1) 오버레이 클릭 시 닫기 */
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    if (loading) return <Loader />;
    if (error) return <ErrorScreen msg={error} />;
    if (!courtData) return <Empty />;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <h3 className="text-2xl font-bold text-center">지도 화면</h3>

            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-main text-white font-medium rounded-md px-4 py-2 text-lg"
            >
                테니스장 상세
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={handleBackdropClick}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-[305px] max-w-md shadow-lg space-y-4"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* 모달 내부 */}
                        <Header court={courtData} />
                        <Body court={courtData} />
                        <Footer />
                    </div>
                </div>
            )}
        </main>
    );
}

/* ----------- 보조 컴포넌트 (가독성용) ------------- */
function Loader() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <p>Loading...</p>
        </main>
    );
}
function ErrorScreen({ msg }: { msg: string }) {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <p className="text-red-500">{msg}</p>
        </main>
    );
}
function Empty() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">No court data available.</p>
        </main>
    );
}
function Header({ court }: { court: Court }) {
    return (
        <div className="flex items-center gap-2">
            <Image src={marker} alt="marker" width={20} height={20} />
            <div className="flex flex-col">
                <span className="text-[15px] font-bold">{court.court_name}</span>
                <span className="text-[8px]">{court.address ?? "주소 없음"}</span>
            </div>
            <FavoriteToggle />
        </div>
    );
}
function Body({ court }: { court: Court }) {
    return (
        <div className="flex gap-4 items-start">
            {court.court_image ? (
                <img
                    src={court.court_image}
                    alt={`${court.court_name} 이미지`}
                    className="rounded-md object-cover w-[119px] h-[119px]"
                />
            ) : (
                <div className="w-[119px] h-[119px] bg-gray-200 rounded-md" />
            )}

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1">
                    <Image src={phoneIcon} alt="phone" width={10} height={11} />
                    <div className="flex flex-row gap-2">
                        <b className="text-[10px]">전화번호</b>{" "}
                        <span className="text-[8px] mt-0.25">
              {court.telno ?? "정보 없음"}
            </span>
                    </div>
                </div>
                <button className="bg-main text-white rounded-md px-4 py-2 text-xs">
                    채팅방 리스트 보기
                </button>
                <button className="bg-main text-white rounded-md px-4 py-2 text-xs">
                    채팅방 생성하기
                </button>
            </div>
        </div>
    );
}
function Footer() {
    return (
        <div className="mt-4 flex justify-end">
            <button className="text-gray-400 text-[9px] font-semibold">
                상세정보 &gt;
            </button>
        </div>
    );
}
