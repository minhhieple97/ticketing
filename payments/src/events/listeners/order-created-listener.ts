import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, Subjects } from "@lmhticket/common";
import { Listener } from "@lmhticket/common";
import { Order } from '../../models/order'
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        });
        await order.save()
        msg.ack();
    }
}
