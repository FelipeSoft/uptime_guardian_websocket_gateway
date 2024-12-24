import Logger from "@/core/http/Logger";
import { WebSocketConnection } from "@/core/websocket/Connection";
import { WebSocketEvent, WebSocketIncomingRequest, WebsocketServer } from "@/core/websocket/Server";
import { WebSocket } from "ws";

export default class WebSocketWsAdapter implements WebsocketServer {
    private ws;

    public constructor(
        private readonly port: number,
    ) {
        this.ws = new WebSocket.Server({ port: this.port })
        new Logger("Websocket Server", `WS Server listening on port ${this.port} 👻`)
    }

    public on(event: WebSocketEvent, callback: (connection: WebSocketConnection, request: WebSocketIncomingRequest) => void): void {
        this.ws.on(event, callback)
    }
}