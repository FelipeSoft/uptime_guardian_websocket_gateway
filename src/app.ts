import { configDotenv } from "dotenv"
import HttpServerExpressAdapter from "@/infrastructure/http/express/HttpExpressServerAdapter"
import MainRoutes from "@/application/routes/MainRoutes";
import WebSocketWsAdapter from "@/infrastructure/websocket/ws/WebSocketWsAdapter";
import WebSocketWsConnectionAdapter from "@/infrastructure/websocket/ws/WebSocketWsConnectionAdapter";
import WebSocketAuthInterceptor from "@/application/interceptor/auth/WebSocketAuthInterceptor";
import JwtTokenManagerAdapter from "@/infrastructure/jsonwebtoken/JwtTokenManagerAdapter";
import KafkaStreamProcessor from "./infrastructure/kafka/KafkaStreamProcessor";
import WebSocketMessageOrchestratorInterceptor from "./application/interceptor/WebSocketMessageOrchestratorInterceptor";

function init() {
    configDotenv();

    const streamProcessor = new KafkaStreamProcessor();
    const jwtTokenManagerAdapter = new JwtTokenManagerAdapter();
    const webSocketMessageOrchestratorInterceptor = new WebSocketMessageOrchestratorInterceptor(streamProcessor);

    const httpPort: number = Number(process.env.HTTP_PORT) || 3030;
    const httpServer = new HttpServerExpressAdapter(MainRoutes);

    httpServer.router();
    httpServer.listen(httpPort);

    const websocketPort: number = Number(process.env.WEBSOCKET_PORT) || 3031;
    const websocketServer = new WebSocketWsAdapter(websocketPort);

    websocketServer.on("connection", (ws, req) => {
        const websocketConnection = new WebSocketWsConnectionAdapter(ws);
        const webSocketAuthInterceptor = new WebSocketAuthInterceptor(ws, jwtTokenManagerAdapter);
        webSocketAuthInterceptor.execute(req.url.split("=")[1]);

        websocketConnection.on("message", (message) => {
            try {
                const jsonMessage = JSON.parse(message.toString());
                webSocketMessageOrchestratorInterceptor.execute(jsonMessage);
            } catch (error: any) {
                if (error instanceof Error) {
                    ws.close(4000, error.message);
                    return;
                }
                ws.close(4000, "internal server error");
            }
        });
    });
}

export default init()