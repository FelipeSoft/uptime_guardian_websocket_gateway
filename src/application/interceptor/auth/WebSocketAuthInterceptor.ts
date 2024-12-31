import TokenManager from "@/core/TokenManager";
import { WebSocketConnection } from "@/core/websocket/Connection";
import { JsonWebTokenError } from "jsonwebtoken";

export default class WebSocketAuthInterceptor {
    public constructor(
        private readonly webSocketConnection: WebSocketConnection,
        private readonly tokenManager: TokenManager
    ) { }

    public execute(token: string | null) {
        if (token) {
            try {
                const validToken = this.tokenManager.verify(token);
                const currentTime = Math.floor(Date.now() / 1000);

                if (validToken.exp < currentTime) {
                    this.webSocketConnection.close(4001, "expired token");
                    return
                }
            } catch (error) {
                if (error instanceof JsonWebTokenError) {
                    this.webSocketConnection.close(4001, "expired token");
                }
            }
            return;
        }
        this.webSocketConnection.close(4001, "missing token");
    }
}