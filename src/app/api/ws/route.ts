import {NextRequest, NextResponse} from "next/server";
import { WebSocketServer, WebSocket } from "ws";
import {prisma} from "@/utils/prismaClient";
import { IncomingMessage } from "http";

interface Client {
    id: string;
    ws: WebSocket;
}

let wss: WebSocketServer | null = null;
let clients: Client[] = [];

export async function GET(nextRequest: NextRequest) {
    if (!wss) {
        console.log("WebSocket server is initializing");

        wss = new WebSocketServer({ port: 3001 });

        wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            console.log(url)
            const clientId = nextRequest.cookies.get("user_id")?.value;
            if (!clientId) {
                ws.close();
                return;
            }
            const user = await prisma.user.findUnique({ where: { user_id: +clientId }},);
            const nickname = user?.nickname;
            if (!nickname) {
                ws.close();
                return;
            }
            clients.push({ id: nickname, ws });

            ws.send(JSON.stringify({ type: "id", id: nickname }));

            ws.on("message", (message: string) => {
                const data = JSON.parse(message);
                if (data.type === "broadcast") {
                    clients.forEach((client) => {
                        if (client.id !== data.from) {
                            client.ws.send(
                                JSON.stringify({
                                    type: "broadcast",
                                    from: data.from,
                                    message: data.message,
                                })
                            );
                        }
                    });
                }
            });

            ws.on("close", () => {
                clients = clients.filter((client) => client.ws !== ws);
            });
        });
    }

    return NextResponse.json({ message: "WebSocket server is running" });
}

export const config = {
    api: {
        bodyParser: false,
    },
};
