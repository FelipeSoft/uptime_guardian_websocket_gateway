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

        try {
            const rawQueryParams = req.url.split("/?token=");
            const tokenFromQueryParam = rawQueryParams[1]
            webSocketAuthInterceptor.execute(tokenFromQueryParam);
        } catch (error) {
            if (error instanceof TypeError) {
                ws.send(JSON.stringify({ error: true, message: "malformed websocket url; check the manual on section 'WebSocket Gateway URL' and try again." }));
            }
        }

        websocketConnection.on("message", async (message) => {
            try {
                const jsonMessage = JSON.parse(message.toString());
                const result = await webSocketMessageOrchestratorInterceptor.execute(jsonMessage);
                if (result.error) {
                    ws.send(JSON.stringify({ error: true, message: result.message }));
                }
            } catch (error) {
                if (error instanceof Error) {
                    ws.send(JSON.stringify({ error: true, message: error.message }));
                } else {
                    ws.send(JSON.stringify({ error: true, message: "Internal Server Error" }));
                }
            }
        });
    });
}

export default init()