export default interface HttpRequest {
    body(): any;
    query(): any;
    params(): any;
}