import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Subjects, TicketUpdatedEvent } from '@lmhticket/common';
import { TicketCreatedEvent } from '@lmhticket/common';
import { Listener } from '@lmhticket/common';
import { Ticket } from '../../models/ticket';
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        const ticket = await Ticket.findOne({
            _id: id,
            version: data.version - 1
        });
        if (!ticket) {
            throw new Error("Ticket not found");
        }
        ticket.set({ title, price });
        await ticket.save()
        msg.ack()
    }
}