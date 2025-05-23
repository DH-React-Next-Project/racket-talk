import logoBall from "@/assets/chat/logo-ball.svg";
import Image from "next/image";
import Link from "next/link";

const ChatRoom = (props: CourtChats[]) => {
    return (
        <div className="flex flex-col overflow-y-auto">
            {props.map((court: CourtChats) => (
                <div key={court.courtName} className="pb-4 px-4">
                    <div className="font-bold text-charcoal pb-2">
                        {court.courtName}
                    </div>
                    {court.rooms.map((room) => (
                        <Link
                            href={{
                                pathname: `/chat-room/${room.roomId}`,
                                query: {
                                    courtName: room.courtDetailName,
                                    roomName: room.roomName,
                                },
                            }}
                            key={room.roomId}
                            className="p-2 flex"
                        >
                            <Image
                                src={logoBall}
                                alt="logo"
                                className="w-13 h-13 flex-shrink-0"
                            />
                            <div className="mx-4 px-2 pb-2 border-b border-lightGray2 flex flex-col min-w-0 w-full">
                                <div className="text-lg font-bold">
                                    {room.roomName}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-full">
                                    {room.message}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
};
export default ChatRoom;
