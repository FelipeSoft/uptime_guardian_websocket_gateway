import HttpRequest from "./Request";
import HttpResponse from "./Response";

export default interface HttpMiddleware {
    execute(request: HttpRequest, response: HttpResponse, next: Function): void;
}