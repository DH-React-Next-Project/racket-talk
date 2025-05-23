"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/_components/layouts/Header";
import CourtChatRoom from "@/_components/chat/CourtChatRoom";

export default function CourtChatListPage() {
    const searchParams = useSearchParams();
    const courtId = searchParams.get("courtId");
    const courtDetailId = searchParams.get("courtDetailId");
    const [roomList, setRoomList] = useState<Record<string, CourtChatRoom[]>>(
        {}
    );
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch(
            `/api/chat/room-list?courtId=${courtId}&courtDetailId=${courtDetailId}`
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.error(data.error);
                    return;
                }
                setRoomList(data.groupedByCourtDetail);
                setLoading(false);
            });
    }, [courtId, courtDetailId]);
    if (loading) {
        return <p className="p-6">로딩 중…</p>;
    }
    return (
        <div className="flex flex-col h-screen pb-24 pt-20">
            <Header showBackButton={true}/>
            {Object.keys(roomList).length > 0 ? (
                <CourtChatRoom data={roomList} />
            ) : (
                <p className="p-6">생성된 채팅방이 없습니다.</p>
            )}
        </div>
    );
}
