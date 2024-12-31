import OrchestratorMessage from "@/core/OrchestratorMessage";
import StreamProcessor from "@/core/StreamProcessor";

export default class WebSocketMessageOrchestratorInterceptor {
    public constructor(
        private readonly streamProcessor: StreamProcessor
    ) {}

    public async execute(message: Object): Promise<{ error?: boolean, message?: string }> {
        let orchestratorMessage;
        try {
            orchestratorMessage = new OrchestratorMessage(message);
        } catch (error) {
            if (error instanceof Error) {
                return { error: true, message: error.message };
            }
            return { error: true, message: "Internal Server Error" };
        }
        const validInput = orchestratorMessage.getValidMessage();
        if (validInput) {
            // this.streamProcessor.publish("websocket_gateway_to_notification_service", validInput);
            // this.streamProcessor.publish("websocket_gateway_to_metric_service", validInput);
            // this.streamProcessor.publish("websocket_gateway_to_metadata_service", validInput);
        }
        return { error: false };
    }
}