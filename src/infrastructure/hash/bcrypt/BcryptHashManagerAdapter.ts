import HashManager from "@/core/HashManager";
import * as bcrypt from "bcrypt";

export default class BcryptHashManagerAdapter implements HashManager {
    public async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }
    
    public async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}