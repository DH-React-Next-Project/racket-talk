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
    const [nickName, setNickName] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!roomId) return;
        if (socketRef.current) return;

        const connectWebSocket = async () => {
            await fetch("/api/ws");
            const ws = new WebSocket(
                `${process.env.NEXT_PUBLIC_WS_URL}?roomId=${roomId}`
            );

            ws.onopen = async () => {
                try {
                    const res = await fetch(
                        `/api/chat/history?roomId=${roomId}`
                    );
                    const data = await res.json();
                    setMessages(data.messages);
                } catch (error) {
                    console.error("Error loading history:", error);
                }
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "id") {
                    setNickName(data.id);
                } else {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            roomId: Number(roomId),
                            message: data.message,
                            username: data.username,
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
        if (message && socketRef.current && nickName) {
            const messageData: Message = {
                roomId: Number(roomId),
                username: nickName,
                message: message,
                time: new Date(),
            };
            socketRef.current.send(JSON.stringify(messageData));
            setMessage("");
        }
    };

    const onBackButtonClick = () => {
        window.history.back();
    };

    const onOutButtonClick = async () => {
        try {
            const res = await fetch(`/api/chat/leave-room?roomId=${roomId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                alert("방 나가기에 실패했습니다.");
                return;
            }

            alert("채팅방을 나왔습니다.");
            window.history.back();
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("알 수 없는 오류:", err);
            }
        }
    };

    return (
        <div className="flex flex-col h-screen pb-24">
            <Header
                onBackButtonClick={onBackButtonClick}
                onOutButtonClick={onOutButtonClick}
                showButton={true}
            />
            <div className="flex mx-4 mt-2 items-end relative">
                <div className="w-full absolute -top-15 flex justify-between"></div>
                <div className="px-4 py-2 bg-main text-white rounded-md">
                    {courtName}
                </div>
                <div className="underline mx-4 decoration-lightGray">
                    {roomName}
                </div>
            </div>
            <Messages messages={messages} username={nickName ? nickName : ""} />
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
