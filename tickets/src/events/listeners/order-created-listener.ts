import { TicketUpdatedPublisher } from "./../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, Subjects } from "@lmhticket/common";
import { Listener } from "@lmhticket/common";
import Ticket from "../../models/ticket";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new Error("Ticket not found.");
    ticket.set({ orderId: data.id });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      //@ts-ignore
      orderId: ticket.orderId,
      version: ticket.version,
    });
    msg.ack();
  }
}
