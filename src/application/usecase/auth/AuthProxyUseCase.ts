import { AuthKeyRepository } from "@/core/AuthKey";
import TokenManager from "@/core/TokenManager";

export default class AuthProxyUseCase {
    public constructor(
        private readonly authKeyRepository: AuthKeyRepository,
        private readonly tokenManager: TokenManager,
    ) { }

    public async execute(input: Input): Promise<Output> {
        // temporary solution, this method will be change on future by cache storing the auth keys of each Proxy
        // and still, the cache storage will be updated every X time amount of time
        // the auth keys will arrive through Apache Kafka

        const proxyId = input.proxyId;
        const proxyPassword = input.proxyPassword;

        if (isNaN(Number(proxyId))) {
            throw new Error("param 'proxyId' is not a number.");
        }

        const foundAuthKey = await this.authKeyRepository.findByKey(proxyId);
        if (foundAuthKey) {
            foundAuthKey.setPassword(proxyPassword)
            const authorized = await foundAuthKey.check()
            const isNotAuthorized = !authorized;

            if (authorized) {
                return {
                    authorized: true,
                    token: this.tokenManager.sign({ proxyId })
                };
            }

            if (isNotAuthorized) {
                return {
                    authorized: false,
                    token: null
                };
            }
        }

        return {
            authorized: false,
            token: null
        };
    }
}

type Input = {
    proxyId: string;
    proxyPassword: string;
}

type Output = {
    authorized: boolean;
    token: string | null;
}