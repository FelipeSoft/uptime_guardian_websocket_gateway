import { MessageType } from "./OrchestratorMessage";
import IcmpMessageStrategy, { IcmpMessage } from "./strategy/IcmpMessageStrategy";
import AgentMessageStrategy, { AgentMessage } from "./strategy/AgentMessageStrategy";

export interface MessageStrategy {
    validate(message: object): StrategyOutput;
}

export type StrategyOutput = { isValid: boolean, validMessage?: ValidMessage }
export type ValidMessage = IcmpMessage | AgentMessage

export default class MessageFactory {
    public static create(type: MessageType): MessageStrategy {
        switch (type) {
            case "icmp":
                return new IcmpMessageStrategy()
            case "agent":
                return new AgentMessageStrategy()
            default:
                throw new Error("invalid message format on message factory; availables: icmp and agent; provided:")
        }
    }
}