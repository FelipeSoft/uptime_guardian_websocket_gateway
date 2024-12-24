export default interface TokenManager {
    sign(body: any): string;
    decode(token: string): any;
    verify(token: string): any;
}