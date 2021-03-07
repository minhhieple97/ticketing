import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();
const stan = nats.connect("ticketing", "abc", {
  // stan đóng vai trò là client, client sẽ giao tiếp với server (nats-streaming-server) để gửi và tiếp nhận sự kiện.
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");
  const publisher = await new TicketCreatedPublisher(stan);
  try {
    const result = await publisher.publish({
      id: "1",
      title: "test message",
      price: 400,
      userId: "1",
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});
