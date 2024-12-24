import HttpMiddleware from "@/core/http/Middleware";
import HttpRequest from "@/core/http/Request";
import HttpResponse from "@/core/http/Response";

export type HttpMethod = "GET" | "POST";

export type HttpRoute = {
    pattern: string;
    method: HttpMethod;
    middlewares?: HttpMiddleware[];
    callback: (request: HttpRequest, response: HttpResponse, next: Function) => void;
}