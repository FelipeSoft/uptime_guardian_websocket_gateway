import KafkaStreamProcessor from "./infrastructure/kafka/KafkaStreamProcessor";

async function test() {
    const kafka = new KafkaStreamProcessor();
    const result = await kafka.consume("websocket_gateway_to_notification_service");
    console.log(result);
}

test();