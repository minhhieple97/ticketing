import { Message } from "node-nats-streaming";
import { Listener } from "@sgtickets/common";
import { TicketCreatedEvent } from "@sgtickets/common";
import { Subjects } from "@sgtickets/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}
