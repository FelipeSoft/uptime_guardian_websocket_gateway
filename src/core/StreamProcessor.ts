export default interface StreamProcessor {
    publish(topic: string, message: any): Promise<void> | void;
    consume(topic: string): Promise<any> | any;
    subscribe(topic: string, callback: (message: any) => void): Promise<void> | void;
}