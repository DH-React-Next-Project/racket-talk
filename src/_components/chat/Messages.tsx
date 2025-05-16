"use client";

import { useEffect, useRef } from "react";
import dayjs from "dayjs";

interface MessagesProp {
    messages: Array<Message>;
    username: string;
}

export default function Messages(prop: MessagesProp) {
    const messages: Array<Message> = prop.messages;
    const scrollRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);
    let prevDate = new Date();
    if (messages.length > 0) {
        prevDate = messages[0].time;
    }

    const printDate = (date: Date) => {
        if (prevDate.getDate() !== date.getDate()) {
            prevDate = date;
            return (
                <div className="text-lightGray text-xs text-center my-2">
                    {dayjs(date).format("YYYY-MM-DD")}
                </div>
            );
        } else {
            return <></>;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto px-8 py-2" ref={scrollRef}>
            <div className="bg-lightGray text-white text-xs text-center my-2 rounded-md mx-auto w-30 py-1">
                {dayjs(prevDate).format("YYYY년 MM월 DD일")}
            </div>
            {messages.map((m, idx) => {
                const isMe = prop.username === m.username;
                const time = dayjs(m.time).format("hh:mm A");
                return (
                    <div key={idx}>
                        {printDate(m.time)}
                        <div className="">
                            <div
                                className={
                                    isMe
                                        ? "flex flex-col items-end"
                                        : "flex flex-col items-start"
                                }
                            >
                                <div className="msg_username">
                                    {isMe ? "나" : m.username}
                                </div>
                                <div
                                    className={
                                        isMe
                                            ? "bg-main relative px-4 py-2 text-white rounded-md max-w-8/10 break-words"
                                            : "bg-sub relative px-4 py-2 text-white rounded-md max-w-8/10 break-words"
                                    }
                                >
                                    {m.message}
                                    {isMe ? (
                                        <div
                                            className="absolute right-[-8px] bottom-2 w-0 h-0 border-t-8
                                            border-t-transparent border-b-8 border-b-transparent
                                             border-l-8 border-main"
                                        ></div>
                                    ) : (
                                        <div
                                            className="absolute left-[-8px] bottom-2 w-0 h-0 border-t-8
                                            border-t-transparent border-b-8 border-b-transparent
                                             border-r-8 border-sub"
                                        ></div>
                                    )}
                                </div>
                                <div className="text-lightGray text-xs">
                                    {time}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
