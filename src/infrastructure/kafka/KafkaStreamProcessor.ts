import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import StreamProcessor from '@/core/StreamProcessor';

export default class KafkaStreamProcessor implements StreamProcessor {
    private kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;

    constructor() {
        this.kafka = new Kafka({
            brokers: process.env.KAFKA_BROKERS?.split(",") ?? ["localhost:9092"],
            clientId: process.env.KAFKA_CLIENT_ID
        });
        console.log(process.env.KAFKA_BROKERS?.split(","));
        console.log(process.env.KAFKA_CLIENT_ID);
        console.log(process.env.KAFKA_CONSUMERS_GROUP_ID);
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_CONSUMERS_GROUP_ID ?? "" });
    }

    public async publish(topic: string, message: any): Promise<void> {
        try {
            console.log("message to kafka publishing")
            console.log(message)
            await this.producer.connect();
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(message) }],
            });
        } catch (error) {
            console.error('Failed to publish message:', error);
            throw error;
        } finally {
            await this.producer.disconnect();
        }
    }

    public async consume(topic: string): Promise<any> {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic, fromBeginning: true });

        return new Promise((resolve, reject) => {
            this.consumer.run({
                eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                    if (message.value) {
                        resolve(JSON.parse(message.value.toString()));
                    } else {
                        reject(new Error('No message value found'));
                    }
                },
            });
        });
    }

    public async subscribe(topic: string, callback: (message: any) => void): Promise<void> {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic, fromBeginning: true });

        this.consumer.run({
            eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                if (message.value) {
                    callback(JSON.parse(message.value.toString()));
                }
            },
        });
    }
}