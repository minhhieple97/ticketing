import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
console.clear();
const stan = nats.connect("ticketing", randomBytes(16).toString("hex"), {
  // stan đóng vai trò là client, client sẽ giao tiếp với server (nats-streaming-server) để gửi và tiếp nhận sự kiện.
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");
  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe(
    "ticket:created",
    "listenerQueueGroup",
    options
  );
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    console.log(msg.getSequence(), data);
    // msg.ack();
  });
});
