import OrchestratorMessage from "@/core/OrchestratorMessage";

describe("testing all units of OrchestratorMessage entity", () => {
    it("should define the validMessage property if correct message setted", () => {
        const validMessage = {
            unit: "proxy",
            identifier: 1,
            data: {
                metric: "ms",
                latency: 20,
                heartbeat: 8,
            }
        }
        const orchestratorMessage = new OrchestratorMessage(validMessage);
        expect(orchestratorMessage).toBeDefined();
        expect(orchestratorMessage.getValidMessage()).not.toBeUndefined();
    });
    it("should throw an error if the validMessage is not setted correctly", () => {
        const validMessage = {
            unit: "proxy",
            identifier: 1,
            data: {
                latency: 20,
                heartbeat: 8,
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
});