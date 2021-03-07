import mongoose from "mongoose";
import app from "./app";
import { natsWrapper } from "./nats-wrapper";
const start = async () => {
  try {
    if (!process.env.MONGO_URI || !process.env.JWT_KEY) {
      throw new Error("Missing environment variable,");
    }
    await mongoose.connect(process.env.MONGO_URI!, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await natsWrapper.connect("ticketing", "123", "http://nats-service:4222");
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000.");
  });
};
start();
