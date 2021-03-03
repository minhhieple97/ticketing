import nats from "node-nats-streaming";
console.clear();
const stan = nats.connect("ticketing", "abc", {
  // stan đóng vai trò là client, client sẽ giao tiếp với server (nats-streaming-server) để gửi và tiếp nhận sự kiện.
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");
  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });
  stan.publish("ticket:created", data, () => {
    console.log("Event publisher");
  });
});
