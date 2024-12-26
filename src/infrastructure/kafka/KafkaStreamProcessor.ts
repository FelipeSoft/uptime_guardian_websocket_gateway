import { Kafka, Producer, Consumer, EachMessagePayload, Partitioners } from 'kafkajs';
import StreamProcessor from '@/core/StreamProcessor';

export default class KafkaStreamProcessor implements StreamProcessor {
    private kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;
    
    constructor() {
        try {
            this.kafka = new Kafka({
                brokers: ["localhost:9092"],
                clientId: process.env.KAFKA_CLIENT_ID ?? "uptime_guardian_websocket_gateway"
            });
            this.producer = this.kafka.producer({
                createPartitioner: Partitioners.LegacyPartitioner
            });
            this.consumer = this.kafka.consumer({
                groupId: process.env.KAFKA_CONSUMERS_GROUP_ID ?? "uptime_guardian_websocket_gateway_consumers_group",
            });
        } catch (error) {
            console.log("error on constructor: " + error)
            throw error
        }   
    }

    public async publish(topic: string, message: any): Promise<void> {
        try {
            await this.producer.connect();
            console.log("Connected with Apache Kafka");
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(message) }],
            });
            console.log("Message sent!");
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