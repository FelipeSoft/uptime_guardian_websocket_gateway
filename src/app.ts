import { configDotenv } from "dotenv"
import HttpServerExpressAdapter from "@/infrastructure/http/express/HttpExpressServerAdapter"
import MainRoutes from "@/application/routes/MainRoutes";
import WebSocketWsAdapter from "@/infrastructure/websocket/ws/WebSocketWsAdapter";
import WebSocketWsConnectionAdapter from "@/infrastructure/websocket/ws/WebSocketWsConnectionAdapter";
import WebSocketAuthInterceptor from "@/application/interceptor/auth/WebSocketAuthInterceptor";
import JwtTokenManagerAdapter from "@/infrastructure/jsonwebtoken/JwtTokenManagerAdapter";

function init() {
    configDotenv()
    const httpPort: number = Number(process.env.HTTP_PORT) || 3030;
    const httpServer = new HttpServerExpressAdapter(MainRoutes);
    httpServer.router();
    httpServer.listen(httpPort);

    const websocketPort: number = Number(process.env.WEBSOCKET_PORT) || 3031;
    const websocketServer = new WebSocketWsAdapter(websocketPort)
    if (process.env.WEBSOCKET_BASE_URL) {
        websocketServer.on("connection", (ws, req) => {
            const websocketConnection = new WebSocketWsConnectionAdapter(ws);
            const jwtTokenManagerAdapter = new JwtTokenManagerAdapter();
            const webSocketAuthInterceptor = new WebSocketAuthInterceptor(ws, jwtTokenManagerAdapter);
            webSocketAuthInterceptor.execute(req.url.split("=")[1]);

            websocketConnection.send("hello from server!");
            websocketConnection.on("message", (message) => {
                console.log(message.toString());
            });
        });
    }
}

export default init()