import { NextResponse } from "next/server";
import { WebSocketServer, WebSocket } from "ws";

interface Client {
    id: string;
    ws: WebSocket;
}

let wss: WebSocketServer | null = null;
let clients: Client[] = [];

export async function GET() {
    if (!wss) {
        console.log("WebSocket server is initializing");

        wss = new WebSocketServer({ port: 3001 });

        wss.on("connection", (ws) => {
            // TODO: 클라이언트 아이디 관리리
            const clientId = Math.random().toString(36).substring(7);
            clients.push({ id: clientId, ws });

            ws.send(JSON.stringify({ type: "id", id: clientId }));

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
