"use client";

import { useState, useEffect } from "react";
import ChatRoom from "@/_components/chat/ChatRoom";

const ChatRoomPage = () => {
    const [roomList, setRoomList] = useState<CourtChats[]>([]);
    useEffect(() => {
        fetch('/api/chat/join-room-list')
            .then(res => res.json())
            .then(data => setRoomList(data.data));
    }, [])
    return (
        <div className="flex flex-col h-screen">
            <div className="bg-main text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">헤더 자리</h1>
            </div>
            <div className="flex-1">
                <div className="text-charcoal font-bold text-xl m-4">내 채팅 리스트</div>
                {roomList.length > 0 ? ChatRoom(roomList) : <></>}
            </div>
            <div className="bg-main text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">풋터 자리</h1>
            </div>
        </div>
    );
}
export default ChatRoomPage;