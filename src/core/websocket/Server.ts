import { WebSocketConnection } from "./Connection";

export type WebSocketEvent = "message" | "connection" | "close" | "error" | "headers" | "listening";
export type WebSocketIncomingRequest = {
    url: string;
}

export interface WebsocketServer {
    on(event: WebSocketEvent, callback: (connection: WebSocketConnection, request: WebSocketIncomingRequest) => void): void;
}