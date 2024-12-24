import HttpRequest from "@/core/http/Request";
import { Request } from "express";

export default class HttpExpressRequest implements HttpRequest {
    public constructor (
        private readonly request: Request
    ) {}

    public async body() {
        return this.request.body;
    }

    public async query() {
        return this.request.query;
    }

    public async params() {
        return this.request.params;
    }
}