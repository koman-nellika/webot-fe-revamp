/* eslint-disable @typescript-eslint/no-var-requires */
const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  retry: {
    retries: 3,
  },
  brokers: process.env.KAFKA_HOST?.split(','),
});
const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});
const isEnabledKafka = process.env.KAFKA_ENABLED === 'true';

const send = async ({ type, message }) => {
  if (!producer || !isEnabledKafka) return;
  await producer.connect();
  const topic = `${process.env.KAFKA_TOPIC_PREFIX}-${type}`;
  return producer
    .send({
      topic: topic,
      messages: [{ key: 'string', value: JSON.stringify(message) }],
    })
    .catch((e) => console.error(`kafka send message error: ${e.message}`, e));
};

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach((type) => {
  process.on(type, async () => {
    try {
      await producer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    try {
      await producer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});
module.exports.send = send;
