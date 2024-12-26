import OrchestratorMessage from "@/core/OrchestratorMessage";
import StreamProcessor from "@/core/StreamProcessor";

export default class WebSocketMessageOrchestratorInterceptor {
    public constructor (
        private readonly streamProcessor: StreamProcessor
    ) {}

    public async execute(message: Object) {
        let orchestratorMessage;
        try {
            orchestratorMessage = new OrchestratorMessage(message);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            return;
        }
        const validInput = orchestratorMessage.getValidMessage();
        if (validInput) {
            this.streamProcessor.publish("websocket_gateway_to_notification_service", validInput);
            this.streamProcessor.publish("websocket_gateway_to_metric_service", validInput);
            this.streamProcessor.publish("websocket_gateway_to_metadata_service", validInput);
        }
    }
}