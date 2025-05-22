type Message = {
    username: string;
    message: string;
    time: Date;
};
type Room = {
    room_id: number;
    courtDetailName: string;
    roomName: string;
    message: string;
    memo: string;
}
type CourtChats = {
    courtName: string;
    rooms: Room[];
}