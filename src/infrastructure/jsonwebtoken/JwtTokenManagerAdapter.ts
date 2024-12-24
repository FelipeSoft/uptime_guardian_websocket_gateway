import TokenManager from "@/core/TokenManager";
import * as jsonwebtoken from "jsonwebtoken";

export default class JwtTokenManagerAdapter implements TokenManager {
    private jwt = jsonwebtoken;

    public constructor() {}

    public verify(token: string) {
        if (!process.env.JWT_SECRET) {
            throw new Error("failed on verify jwt token");
        }
        return this.jwt.verify(token, process.env.JWT_SECRET);
    }

    public sign(body: any): string {
        if (!process.env.JWT_SECRET) {
            throw new Error("failed on sign jwt token");
        }
        return this.jwt.sign(body, process.env.JWT_SECRET, { expiresIn: "10m" });
    }

    public decode(token: string) {
        return this.jwt.decode(token, { complete: true, json: true });
    }
}