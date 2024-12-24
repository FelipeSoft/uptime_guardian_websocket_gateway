import HttpResponse from "@/core/http/Response";
import HttpStatus from "@/core/http/Status";
import { Response } from "express";

export default class HttpExpressResponse implements HttpResponse {
    public constructor (
        private readonly response: Response
    ) {}

    public send(): void {
        this.send()
    }

    public json(body: any): void {
        this.response.json(body).send();
    }

    public status(httpStatus: HttpStatus): HttpResponse {
        return this.response.status(httpStatus);
    }
}