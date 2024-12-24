export type WebSocketEventAfterConnection = "message" | "open" | "close" | "error" | "ping" | "pong" | "unexpected-response" | "upgrade";

export interface WebSocketConnection {
    on(event: WebSocketEventAfterConnection, callback: (message: Buffer) => void): void;
    send(message: string): void;
    close(code: number, message: string): void;
}