"use client";

import ChatItem from "./ChatItem";

const ChatList = () => {
  return (
    <div>
      <p className="font-semibold text-lg mb-5">내 채팅 리스트</p>
      <ChatItem />
      <ChatItem />
      <ChatItem />
    </div>
  );
};

export default ChatList;
