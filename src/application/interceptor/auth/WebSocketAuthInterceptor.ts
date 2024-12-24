import TokenManager from "@/core/TokenManager";
import { WebSocketConnection } from "@/core/websocket/Connection";

export default class WebSocketAuthInterceptor {
    public constructor(
        private readonly webSocketConnection: WebSocketConnection,
        private readonly tokenManager: TokenManager
    ) { }

    public execute(token: string | null) {
        if (token) {
            try {
                const validToken = this.tokenManager.verify(token);
                console.log(validToken);
            } catch (error) {
                console.error(error);
            }
            return
        }
        this.webSocketConnection.close(4001, "missing token")
    }
}