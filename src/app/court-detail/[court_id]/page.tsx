"use client";

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import Image from "next/image";
import phoneIcon from "@/assets/courts/phone-black.svg";
import clockIcon from "@/assets/courts/clock.svg";
import pointIcon from "@/assets/courts/point.svg";
import FavoriteToggle from "@/_components/court/ToggleFavorite";
import Link from "next/link";

type CourtDetail = {
    court_detail_id: number;
    court_id: number;
    detail_court_name: string;
    detail_operating_time: string;
    target_user_info?: string;
    court_image?: string;
    court_name: string;
    address?: string;
    telno?: string;
};

export default function CourtDetailPage() {
    const {court_id} = useParams<{ court_id: string }>();
    const [details, setDetails] = useState<CourtDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const all:string = "all";

    useEffect(() => {
        if (!court_id) return;

        fetch(`/api/court-detail/${court_id}`)
            .then((r) => r.json())
            .then((data) => setDetails(Array.isArray(data) ? data : [data]))
            .finally(() => setLoading(false));
    }, [court_id]);

    if (loading) return <p className="p-6">로딩 중…</p>;
    if (details.length === 0) return <p className="p-6">데이터가 없습니다.</p>;

    /** 대표 정보는 첫 번째 레코드 기준 */
    const master = details[0];

    /**
     * detailName에서 baseName과 공통된 앞부분을 제거하고,
     * 남은 부분이 없으면 baseName을 그대로 반환합니다.
     */
    function getDetailSuffix(detailName: string, baseName: string): string {
        if (!detailName) return baseName;
        if (!baseName) return detailName;

        // baseName을 정규식 특수문자 없이 안전하게 이스케이프
        const escaped = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // 전체(detailName)에서 baseName이 나타나는 모든 부분을 제거
        const suffix = detailName.replace(new RegExp(escaped, 'g'), '').trim();

        // 잘라낸 뒤 빈 값이면 baseName 그대로
        return suffix || baseName;
    }

    return (
        <>
            {/* ─── 상단(대표) 정보 ─────────────────────────────── */}
            <div className="flex flex-row items-start p-3 mt-4 gap-4 justify-center">
                {/* 이미지 */}
                {master.court_image ? (
                    <img
                        src={master.court_image}
                        alt={`${master.court_name} 이미지`}
                        className="rounded-md w-[125px] h-[125px]"
                    />
                ) : (
                    <div>
                        <span className="text-sm text-gray-500">이미지 없음</span>
                    </div>
                )}

                <div className="flex flex-col gap-2 p-4 -translate-x-4">
                    {/* 이름 */}
                    <div className="flex flex-row Z">
                        <h2 className="text-[15px] font-bold truncate w-[150px] h-[25px]">
                            {master.court_name}
                        </h2>
                        <div className="ml-2">
                            <FavoriteToggle/>
                        </div>
                    </div>


                    {/* 주소 */}
                    <p className="flex items-center gap-1 text-[8px] text-gray-700">
                        <Image src={pointIcon} alt="지도" width={8} height={8}/>
                        <span>{master.address ?? "주소 정보 없음"}</span>
                    </p>

                    {/* 전화번호 */}
                    <div className="flex items-center gap-1 text-[8px] text-gray-700">
                        <Image src={phoneIcon} alt="전화" width={8} height={8}/>
                        <span>{master.telno ?? "전화번호 정보 없음"}</span>
                    </div>
                    {/* 채팅방 리스트 보러가기 */}
                    <div className="relative w-[187px]">
                        <Link href={
                            {
                                pathname: `/court-chat-list`,
                                query: {
                                    courtId: master.court_id,
                                    courtDetailId: all,
                                },
                            }
                        }>
                            <button className="bg-main text-white rounded-md w-full h-[35px] text-[13px]">
                                채팅방 리스트 보러가기
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ─── 상세 코트 목록 ─────────────────────────────── */}
            <div className="p-6 pb-24 space-y-4 pl-10">
                <h3 className="text-[15px] font-bold w-full text-left pl-20">운영중인 코트</h3>

                <div className="grid grid-cols-2 gap-5 max-w-[340px] mx-auto">
                    {details.map((d) => (
                        <section
                            key={d.court_detail_id}
                            className="border border-main rounded-xl p-4 flex flex-col items-center gap-3 w-[159px] h-[159px]"
                        >
                            {/* 코트 이름 */}
                            <h4 className="text-[12px] font-semibold text-left w-full truncate">
                                {getDetailSuffix(d.detail_court_name, d.court_name)}
                            </h4>

                            {/* 운영시간 */}
                            <div className="flex items-start gap-1 text-[8px] self-start">
                                <Image src={clockIcon} alt="운영시간" width={9} height={9}/>
                                <div>
                                    <div className="font-semibold">운영시간</div>
                                    <div>{d.detail_operating_time}</div>
                                </div>
                            </div>

                            {/* 버튼들 */}
                            {/* 버튼들 */}
                            <div className="flex flex-col items-center space-y-1 w-full">
                                <Link href={{
                                        pathname: `/court-chat-list`,
                                        query: {
                                            courtId: d.court_id,
                                            courtDetailId: d.court_detail_id,
                                        },
                                    }}>
                                    <button className="bg-main text-white rounded-md w-[127px] h-[26px] text-[10px] whitespace-nowrap">
                                        채팅방 리스트 보기
                                    </button>
                                </Link>
                                <button
                                    className="bg-main text-white rounded-md w-[127px] h-[26px] text-[10px] whitespace-nowrap">
                                    채팅방 생성하기
                                </button>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </>
    );
}
