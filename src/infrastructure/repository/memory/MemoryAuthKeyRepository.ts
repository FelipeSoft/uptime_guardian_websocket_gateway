import AuthKey, { AuthKeyRepository } from "@/core/AuthKey";
import HashManager from "@/core/HashManager";

export default class MemoryAuthKeyRepository implements AuthKeyRepository {
    public constructor (
        private readonly hashManager: HashManager
    ) {}

    public async findAll(): Promise<AuthKey[]> {
        const output = [new AuthKey(1, "testing...", this.hashManager)]
        return output; 
    }

    public async findByKey(key: string): Promise<AuthKey | null>{
        if (!process.env.PROXY_SHARED_KEY) {
            return null;
        }
        const authKey = new AuthKey(1, process.env.PROXY_SHARED_KEY, this.hashManager);
        return authKey;
    }
}