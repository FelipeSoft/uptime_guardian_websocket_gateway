export default interface HashManager {
    hash(password: string): Promise<string> | string;
    compare(password: string, hash: string): Promise<boolean> | boolean;
}