import ChatList from "./components/ChatItem";
import Header from "./components/Header";

const ChatPage = () => {
  return (
    <div>
      <Header />
      <div className="w-full p-5">
        <ChatList />
      </div>
    </div>
  );
};

export default ChatPage;
