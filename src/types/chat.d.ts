type Message = {
    username: string;
    message: string;
    time: Date;
};
type Room = {
    id: number;
    courtId: string;
    roomName: string;
    ownerId: string;
    lastMessage: Message;
    memo: string;
}
type CourtChats = {
    courtName: string;
    rooms: Room[];
}
