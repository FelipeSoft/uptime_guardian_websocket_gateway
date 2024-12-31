import { StrategyOutput, MessageStrategy } from "../MessageFactory";

export type AgentMessage = {
    messageType: "agent";
    timestamp: number;
    timestampType: "created_time";
    hostId: number;
    addr: string;
    data: {
        metric: "ms";
        latency: number;
    }
}

export default class AgentMessageStrategy implements MessageStrategy {
    public validate(input: object): StrategyOutput {
        if (typeof input !== "object" || input === null) return { isValid: false, validMessage: undefined };

        const msg = input as AgentMessage;

        return {
            isValid: (
                typeof msg.messageType === "string" &&
                typeof msg.timestamp === "number" &&
                msg.timestampType === "created_time" &&
                typeof msg.hostId === "number" &&
                typeof msg.addr === "string" &&
                msg.data !== undefined &&
                msg.data.metric === "ms" &&
                typeof msg.data.latency === "number"
            ),
            validMessage: msg
        }
    }
}