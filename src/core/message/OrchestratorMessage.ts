import MessageFactory, { StrategyOutput, ValidMessage } from "./MessageFactory";

export type MessageType = "agent" | "icmp"

export default class OrchestratorMessage {
    private strategyOutput!: StrategyOutput;

    public constructor(message: object) {
        if (!message.hasOwnProperty("messageType")) {
            throw new Error(`missing messageType property on message.`);
        }
        const messageType = (message as any).messageType;
        if (messageType !== "agent" && messageType !== "icmp") {
            throw new Error(`invalid orchestrator message type; existing types: agent and icmp; provided: ${messageType};`);
        }
        const validInput = this.isValidInput(messageType, message)
        if (validInput.isValid) {
            this.strategyOutput = validInput;
        } else {
            throw new Error("invalid orchestrator message, check the manual and try the unit messaging again.")
        }
    }

    public getValidMessage(): ValidMessage | undefined {
        if (this.strategyOutput.isValid && this.strategyOutput.validMessage) {
            return this.strategyOutput.validMessage;
        }
        return undefined
    }

    private isValidInput(messageType: MessageType, message: object): StrategyOutput {
        return MessageFactory.create(messageType).validate(message)
    }
}
