type Message = {
    roomId: number;
    username: string;
    message: string;
    time: Date;
};
type Room = {
    roomId: number;
    courtDetailName: string;
    roomName: string;
    message: string;
    memo: string;
}
type CourtChats = {
    courtName: string;
    rooms: Room[];
}
type CourtChatRoom = {
    roomId: number;
    roomName: string | null;
    memo: string | null;
    courtDetailName: string;
    isJoined: boolean;
}