import { StrategyOutput, MessageStrategy } from "../MessageFactory";

export type IcmpMessage = {
    messageType: "icmp";
    timestamp: number;
    timestampType: "created_time";
    unit: "host";
    identifier: number;
    data: {
        metric: "ms";
        latency: number;
    }
}

export default class IcmpMessageStrategy implements MessageStrategy {
    public validate(input: object): StrategyOutput {
        if (typeof input !== "object" || input === null) return { isValid: false, validMessage: undefined };

        const msg = input as IcmpMessage;

        return {
            isValid: (
                typeof msg.timestamp === "number" &&
                msg.timestampType === "created_time" &&
                msg.unit === "host" &&
                typeof msg.identifier === "number" &&
                msg.data !== undefined &&
                msg.data.metric === "ms" &&
                typeof msg.data.latency === "number"
            ),
            validMessage: msg
        }
    }
}