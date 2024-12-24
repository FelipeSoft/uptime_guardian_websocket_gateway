import { WebSocketConnection, WebSocketEventAfterConnection } from "@/core/websocket/Server";

export default class WebSocketWsConnectionAdapter implements WebSocketConnection {
    public constructor(private readonly ws: WebSocketConnection) { }

    public on(event: WebSocketEventAfterConnection, callback: (message: Buffer) => void): void {
        this.ws.on(event, callback);
    }

    public send(message: string): void {
        this.ws.send(message);
    }
}