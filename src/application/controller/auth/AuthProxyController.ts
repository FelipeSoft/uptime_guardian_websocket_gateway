import AuthProxyUseCase from "@/application/usecase/auth/AuthProxyUseCase";
import HttpRequest from "@/core/http/Request";
import HttpResponse from "@/core/http/Response";
import HttpStatus from "@/core/http/Status";

export default class AuthProxyController {
    public constructor(
        private readonly authProxyUseCase: AuthProxyUseCase
    ) { }

    public async execute(request: HttpRequest, response: HttpResponse) {
        const { proxyId, proxyPassword } = await request.body();
        if (!proxyId) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: "missing param 'proxyId'." });
        }

        if (!proxyPassword) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: "missing param 'proxyPassword'." });
        }

        try {
            const output = await this.authProxyUseCase.execute({ proxyId, proxyPassword });
            const token = output.token;
            const authorized = output.authorized;
            const isNotAuthorized = !authorized;

            if (authorized && token !== null) {
                return response.status(HttpStatus.OK).json({ token: output.token });
            }

            if (isNotAuthorized || token === null) {
                return response.status(HttpStatus.UNAUTHORIZED).send();
            }
        } catch (error) {
            console.error(error)
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server error" });
        }
    }
}