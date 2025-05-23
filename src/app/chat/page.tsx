"use client";

import { useState, useEffect } from "react";
import ChatRoom from "@/_components/chat/ChatRoom";
import Header from "@/_components/layouts/Header";

const ChatRoomPage = () => {
    const [roomList, setRoomList] = useState<CourtChats[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch('/api/chat/join-room-list')
            .then(res => res.json())
            .then(data => {
                setRoomList(data.data)
                setLoading(false);
            });
    }, [])
    return (

        <div className="flex flex-col h-screen pb-24 pt-20">
            <Header/>
            {loading ? <p>로딩중</p> : <div className="flex-1">
                <div className="text-charcoal font-bold text-xl m-4">내 채팅 리스트</div>
                {roomList.length > 0 ? ChatRoom(roomList) : <></>}
            </div>}
        </div>
    );
}
export default ChatRoomPage;