import logoBall from "@/assets/chat/logo-ball.svg";
import Image from "next/image";

type Props = {
    data: Record<string, CourtChatRoom[]>;
};

export default function CourtChartRoom(prop: Props) {
    const courtDetailNames = Object.keys(prop.data);
    console.log(prop.data);
    return (
        <>
            {courtDetailNames.map((courtDetailName) => {
                return (
                    <div
                        key={courtDetailName}
                        className="font-bold text-charcoal"
                    >
                        <div className="p-4 mt-4 mx-2 mb-6 bg-lightPurple text-white text-center rounded-lg text-2xl">
                            {courtDetailName}
                        </div>{" "}
                        {prop.data[courtDetailName].map(
                            (room: CourtChatRoom) => (
                                <div
                                    key={room.roomId}
                                    className="pb-6 px-6 flex"
                                >
                                    <Image
                                        src={logoBall}
                                        alt="logo"
                                        className="w-13 h-13 flex-shrink-0"
                                    />
                                    <div className="mx-4 px-2 pb-2 border-b border-lightGray2 flex min-w-0 w-full justify-between">
                                        <div className="flex flex-col">
                                            <div className="text-lg font-bold">
                                                {room.roomName}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-full">
                                                {room.memo}
                                            </div>
                                        </div>
                                        <div
                                            className={`flex items-center justify-center text-white rounded-lg px-4 py-2 min-w-1/4 ${
                                                room.isJoined
                                                    ? "bg-lightGray2"
                                                    : "bg-main"
                                            }`}
                                        >
                                            {room.isJoined
                                                ? "참여중"
                                                : "참여하기"}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                );
            })}
        </>
    );
}
