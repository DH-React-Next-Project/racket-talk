"use client";

import { useState, useEffect, useRef } from "react";
import Messages from "@/_components/chat/Messages";
import sentMessage from "@/assets/chat/sent-message.svg";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/_components/layouts/Header";

export default function ChatPage() {
    const params = useParams();
    const roomId = params["room-id"];
    const searchParams = useSearchParams();
    const courtName = searchParams.get("courtName");
    const roomName = searchParams.get("roomName");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!roomId) return;
        if (socketRef.current) return;

        const connectWebSocket = async () => {
            await fetch("/api/ws");
            //TODO url 수정 필요
            const ws = new WebSocket(
                `ws://172.16.20.105:3001?roomId=${roomId}`
            );

            ws.onopen = () => {
                console.log("WebSocket connection established");
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "id") {
                    setUserId(data.id);
                } else {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            message: data.message,
                            username: data.from,
                            time: new Date(),
                        },
                    ]);
                }
            };

            ws.onerror = () => {};

            ws.onclose = () => {};

            socketRef.current = ws;
        };

        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [roomId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message && socketRef.current && userId) {
            const messageData = { room_id: roomId, from: userId, message };
            socketRef.current.send(JSON.stringify(messageData));
            setMessage("");
        }
    };

    const onBackButtonClick = () => {
        window.history.back();
    }

    const onOutButtonClick = () => {
        //TODO 방 나가기 로직 구현 필요
        console.log("방 나가기");
    }

    return (
        <div className="flex flex-col h-screen pb-24">
            <Header onBackButtonClick={onBackButtonClick} onOutButtonClick={onOutButtonClick} showButton={true} />
            <div className="flex mx-4 mt-2 items-end relative">
                <div className="w-full absolute -top-15 flex justify-between">

                </div>
                <div className="px-4 py-2 bg-main text-white rounded-md">
                    {courtName}
                </div>
                <div className="underline mx-4 decoration-lightGray">
                    {roomName}
                </div>
            </div>
            <Messages messages={messages} username={userId ? userId : ""} />
            <form onSubmit={sendMessage} className="p-4">
                <div className="flex">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-lightPurple/15 w-full text-lightGray px-2 rounded-md"
                        placeholder="메세지를 입력하세요."
                    />
                    <button type="submit">
                        <Image
                            src={sentMessage}
                            alt="logo"
                            className="w-8 h-8"
                        />
                    </button>
                </div>
            </form>
        </div>
    );
}
