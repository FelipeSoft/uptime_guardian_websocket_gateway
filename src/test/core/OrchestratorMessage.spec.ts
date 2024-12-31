import { ValidMessage } from "@/core/message/MessageFactory";
import OrchestratorMessage from "@/core/message/OrchestratorMessage";

describe("testing all units of OrchestratorMessage entity", () => {
    it("should define the strategyOutput.validMessage property if correct message setted", () => {
        const validMessage: ValidMessage = {
            messageType: "icmp",
            timestamp: 1234567890,
            timestampType: "created_time",
            unit: "host",
            identifier: 1,
            data: {
                metric: "ms",
                latency: 20
            }
        }
        const orchestratorMessage = new OrchestratorMessage(validMessage);
        expect(orchestratorMessage).toBeDefined();
        expect(orchestratorMessage.getValidMessage()).not.toBeUndefined();
    });
    it("should throw an error if the strategyOutput.validMessage is not setted correctly", () => {
        const validMessage = {
            messageType: "icmp",
            unit: "proxy",
            identifier: 1,
            data: {
                latency: 20,
                heartbeat: 8
            }
        }
        try {
            const orchestratorMessage = new OrchestratorMessage(validMessage);
            expect(orchestratorMessage).toBeDefined();
            expect(orchestratorMessage.getValidMessage()).toBeUndefined();
        } catch (error) {
            expect((error as Error).message).toBe("invalid orchestrator message, check the manual and try the unit messaging again.");
        }
    });
    it("should throw an error if the provided messageType doesn't exists on type ValidMessage" , () => {
        const validMessage = {
            timestamp: 1234567890,
            timestampType: "created_time",
            unit: "host",
            identifier: 1,
            data: {
                metric: "ms",
                latency: 20
            }
        }
        expect(() => new OrchestratorMessage(validMessage)).toThrow("missing messageType property on message.");
    });
});