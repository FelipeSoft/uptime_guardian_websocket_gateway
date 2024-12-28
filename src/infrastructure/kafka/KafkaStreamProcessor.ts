import { Kafka, Producer, Consumer, EachMessagePayload, Partitioners, logLevel } from "kafkajs";
import StreamProcessor from "@/core/StreamProcessor";

export default class KafkaStreamProcessor implements StreamProcessor {
    private kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;
    private isProducerInitialized = false;
    private isConsumerInitialized = false;

    public constructor() {
        try {
            this.kafka = new Kafka({
                brokers: process.env.KAFKA_BROKERS?.split(",") ?? ["192.168.200.154:9092"],
                clientId: process.env.KAFKA_CLIENT_ID ?? "uptime_guardian_websocket_gateway"
            });

            this.producer = this.kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
            this.consumer = this.kafka.consumer({
                groupId: process.env.KAFKA_CONSUMERS_GROUP_ID ?? "uptime_guardian_websocket_gateway_consumers_group",
            });
        } catch (error) {
            console.error("Error initializing KafkaStreamProcessor:", error);
            throw error;
        }
    }

    private async ensureProducerConnection() {
        if (!this.isProducerInitialized) {
            await this.producer.connect();
            this.isProducerInitialized = true;
        }
    }

    private async ensureConsumerConnection() {
        if (!this.isConsumerInitialized) {
            await this.consumer.connect();
            this.isConsumerInitialized = true;
        }
    }

    public async publish(topic: string, message: any): Promise<void> {
        try {
            await this.ensureProducerConnection();
            await this.producer.send({
                topic,
                messages: [{ key: message.key || undefined, value: JSON.stringify(message) }],
            });
            console.log("Message sent!");
        } catch (error) {
            console.error("Error publishing message:", error);
        }
    }

    public async consume(topic: string): Promise<any> {
        try {
            await this.ensureConsumerConnection();
            await this.consumer.subscribe({ topic, fromBeginning: true });

            return new Promise((resolve, reject) => {
                this.consumer.run({
                    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                        if (message.value) {
                            resolve(JSON.parse(message.value.toString()));
                        } else {
                            reject(new Error("No message value found"));
                        }
                    },
                });
            });
        } catch (error) {
            console.error("Error consuming messages:", error);
            throw error;
        }
    }

    public async subscribe(topic: string, callback: (message: any) => void): Promise<void> {
        try {
            if (!this.isConsumerInitialized) {
                await this.consumer.connect();
                this.isConsumerInitialized = true;
            }
    
            console.log(`[KafkaStreamProcessor] Subscribing to topic: ${topic}`);
            
            await this.consumer.subscribe({ topic, fromBeginning: true });
    
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                    try {
                        if (message.value) {
                            const parsedMessage = JSON.parse(message.value.toString());
                            callback(parsedMessage);
                        } else {
                            console.warn(`[KafkaStreamProcessor] Empty message received on topic: ${topic}`);
                        }
                    } catch (error) {
                        console.error(`[KafkaStreamProcessor] Error processing message: ${error}`);
                    }
                },
            });
    
            console.log(`[KafkaStreamProcessor] Consumer is now listening on topic: ${topic}`);
        } catch (error) {
            console.error(`[KafkaStreamProcessor] Error subscribing to topic ${topic}:`, error);
            throw error;
        }
    }    
}
