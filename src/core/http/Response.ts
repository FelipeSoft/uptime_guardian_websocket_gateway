import HttpStatus from "./Status";

export default interface HttpResponse {
    json(body: any): void;
    status(httpStatus: HttpStatus): HttpResponse;
    send(): void;
}