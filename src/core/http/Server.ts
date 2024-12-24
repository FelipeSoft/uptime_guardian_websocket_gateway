import { HttpRoute } from "@/core/http/Routing";

export default abstract class HttpServer {
    public constructor(
        protected readonly routes: HttpRoute[]
    ) {}

    abstract router(): Promise<void> | void;
    abstract listen(port: number): Promise<void> | void;
}