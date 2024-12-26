export default class OrchestratorMessage {
    private validMessage!: Input;

    public constructor(message: object) {
        if (this.isValidInput(message)) {
            this.validMessage = message;
        } else {
            throw new Error("invalid orchestrator message, check the manual and try the unit messaging again.")
        }
    }

    public getValidMessage() {
        if (this.validMessage) {
            return this.validMessage;
        }
    }

    private isValidInput(message: object): message is Input {
        if (typeof message !== "object" || message === null) return false;

        const msg = message as Input;

        return (
            msg.unit === "proxy" &&
            typeof msg.identifier === "number" &&
            msg.data !== undefined &&
            msg.data.metric === "ms" &&
            typeof msg.data.latency === "number" &&
            typeof msg.data.heartbeat === "number"
        )
    }
}

type Input = {
    unit: "proxy";
    identifier: number;
    data: {
        metric: "ms";
        latency: number;
        heartbeat: number;
    }
}