import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCancelledEvent } from "@lmhticket/common";
import mongoose from "mongoose";
import app from "./app";
import { Order } from "./models/order";

import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from './events/listeners/order-created-listener';
const start = async () => {
  try {
    if (!process.env.MONGO_URI || !process.env.JWT_KEY) {
      throw new Error("Missing environment variable,");
    }
    if (
      !process.env.NATS_CLIENT_ID ||
      !process.env.NATS_URL ||
      !process.env.NATS_CLUSTER_ID
    ) {
      throw new Error("Missing environment variable of NATS streaming server");
    }

    await mongoose.connect(process.env.MONGO_URI!, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000.");
  });
};
start();
