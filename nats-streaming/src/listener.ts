import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";
console.clear();
const stan = nats.connect("ticketing", randomBytes(16).toString("hex"), {
  // stan đóng vai trò là client, client sẽ giao tiếp với server (nats-streaming-server) để gửi và tiếp nhận sự kiện.
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");
  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit(); // sử dụng
  });
  new TicketCreatedListener(stan).listen();
});
// theo dõi xem có ấn crt+c hoặc crt+s không, nếu có thì close
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
