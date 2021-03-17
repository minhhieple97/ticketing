import { OrderCancelledEvent } from '@lmhticket/common';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from "./nats-wrapper";
const start = async () => {
  try {
    if (!process.env.NATS_CLIENT_ID || !process.env.NATS_URL || !process.env.NATS_CLUSTER_ID) {
      throw new Error("Missing environment variable of NATS streaming server");
    }
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen()
  } catch (error) {
    console.error(error);
  }

};
start();
