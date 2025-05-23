import { NextResponse } from "next/server";
import { WebSocketServer, WebSocket } from "ws";
import { prisma } from "@/utils/prismaClient";
import { IncomingMessage } from "http";
import { parse } from "cookie";

interface Client {
    id: string;
    ws: WebSocket;
}

let wss: WebSocketServer | null = null;
let clients: Client[] = [];
const rooms = new Map<string, Set<WebSocket>>();

export async function GET() {
    if (!wss) {
        console.log("WebSocket server is initializing");

        wss = new WebSocketServer({ port: 3001 });

        wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            const roomId = url.searchParams.get("roomId");
            if (!roomId) {
                ws.close();
                return;
            }

            const cookies = parse(req.headers.cookie || "");
            const clientId = cookies["user_id"];
            if (!clientId) {
                return;
            }

            const user = await prisma.user.findUnique({
                where: { user_id: +clientId },
            });
            const nickname = user?.nickname;
            if (!nickname) {
                ws.close();
                return;
            }
            console.log(
                `nickname: ${nickname}가 roomId: ${roomId}에 접속했습니다.`
            );

            clients.push({ id: nickname, ws });
            ws.send(JSON.stringify({ type: "id", id: nickname }));

            ws.on("message", async (message: string) => {
                if (!rooms.has(roomId)) {
                    rooms.set(roomId, new Set());
                }
                rooms.get(roomId)!.add(ws);
                const data: Message = JSON.parse(message);
                console.log(data);

                if (!user) {
                    throw new Error(
                        `User with nickname '${data.username}' not found.`
                    );
                }
                const newMessage = await prisma.chat_message.create({
                    data: {
                        room_id: Number(data.roomId),
                        user_id: Number(clientId),
                        message: data.message,
                        sent_at: new Date(data.time),
                    },
                });

                console.log("Message saved:", newMessage);
                rooms.get(roomId)?.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message.toString());
                    }
                });
            });

            ws.on("close", () => {
                clients = clients.filter((client) => client.ws !== ws);
            });
        });
    }

    return NextResponse.json({ message: "WebSocket server is running" });
}
