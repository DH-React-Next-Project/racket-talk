import {NextResponse} from "next/server";

//TODO 더미데이터 삭제, DB에서 가져오기
const data: CourtChats[] = [
    {
        courtName: "Court 1",
        rooms: [
            {
                id: 1,
                courtId: "court1",
                roomName: "Room 1",
                ownerId: "user1",
                lastMessage: {
                    username: "user2",
                    message: "Hello!",
                    time: new Date(),
                },
                memo: "This is a memo for Room 1.",
            },
            {
                id: 2,
                courtId: "court1",
                roomName: "Room 2",
                ownerId: "user3",
                lastMessage: {
                    username: "user4",
                    message: "Hi!",
                    time: new Date(),
                },
                memo: "This is a memo for Room 2.",
            },
        ],
    },
    {
        courtName: "Court 2",
        rooms: [
            {
                id: 3,
                courtId: "court2",
                roomName: "Room 3",
                ownerId: "user5",
                lastMessage: {
                    username: "user6",
                    message: "Hey!",
                    time: new Date(),
                },
                memo: "This is a memo for Room 3.",
            },
            {
                id: 4,
                courtId: "court2",
                roomName: "Room 4",
                ownerId: "user7",
                lastMessage: {
                    username: "user8",
                    message: "Greetings!",
                    time: new Date(),
                },
                memo: "This is a memo for Room 4.",
            },
        ],
    },
]

export async function GET() {
    return NextResponse.json({data: data})
}