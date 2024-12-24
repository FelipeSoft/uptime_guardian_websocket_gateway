import HashManager from "./HashManager";

export interface AuthKeyRepository {
    findAll(): Promise<AuthKey[] | []> | AuthKey[] | [];
    findByKey(key: string): Promise<AuthKey | null> | AuthKey | null;
}

export default class AuthKey {
    private password?: string;

    public constructor(
        private readonly key: number,
        private readonly hashPassword: string,
        private readonly hashManager: HashManager
    ) { }

    public setPassword(password: string) {
        if (!this.password) {
            this.password = password;
        }
    }

    public async check(): Promise<boolean> {
        if (!this.password) {
            throw new Error("cannot check a auth key, missing password")
        }
        return await this.hashManager.compare(this.password, this.hashPassword)
    }
}