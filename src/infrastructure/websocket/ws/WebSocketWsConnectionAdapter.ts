import { WebSocketConnection, WebSocketEventAfterConnection } from "@/core/websocket/Connection";

export default class WebSocketWsConnectionAdapter implements WebSocketConnection {
    public constructor(private readonly ws: WebSocketConnection) { }

    public close(code: number, message: string): void {
        this.ws.close(code, message);
    }

    public on(event: WebSocketEventAfterConnection, callback: (message: Buffer) => void): void {
        this.ws.on(event, callback);
    }

    public send(message: string): void {
        this.ws.send(message);
    }
}