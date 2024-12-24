import Logger from "@/core/http/Logger";
import { HttpRoute } from "@/core/http/Routing";
import HttpServer from "@/core/http/Server";
import e, { NextFunction, Request, Response } from "express";
import HttpExpressRequest from "@/infrastructure/http/express/ExpressRequest";
import HttpExpressResponse from "@/infrastructure/http/express/ExpressResponse";

export default class HttpServerExpressAdapter extends HttpServer {
    private app: e.Application | any;

    public constructor(
        protected readonly routes: HttpRoute[]
    ) {
        super(routes);
        this.app = e();
    }

    public router(): void {
        for (let r = 0; r < this.routes.length; r++) {
            const currentRoute: HttpRoute = this.routes[r]
            this.app.use(e.json());
            this.app.use(e.urlencoded({ extended: true }));
            this.app[currentRoute.method.toLowerCase()](
                currentRoute.pattern,
                async (req: Request, res: Response, next: NextFunction) => {
                    const adaptedRequest = new HttpExpressRequest(req)
                    const adaptedResponse = new HttpExpressResponse(res)

                    if (currentRoute.middlewares) {
                        for (const middleware of currentRoute.middlewares) {
                            await new Promise<void>((resolve, reject) => {
                                middleware.execute(adaptedRequest, adaptedResponse, (err?: any) => {
                                    if (err) return reject(err);
                                    resolve();
                                })
                            })
                        }
                    }

                    currentRoute.callback(adaptedRequest, adaptedResponse, next)
                });
                new Logger("Router", `Mapped {${currentRoute.method} ${currentRoute.pattern}}`
            )
        }
    }

    public listen(port: number): void {
        this.app.listen(port, () => {
            new Logger("HTTP Server", `Express server listening on port ${port} 👻`)
        })
    }
}