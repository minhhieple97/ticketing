import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Subjects } from '@lmhticket/common';
import { TicketCreatedEvent } from '@lmhticket/common';
import { Listener } from '@lmhticket/common';
import { Ticket } from '../../models/ticket';
export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id,
            title,
            price
        });
        await ticket.save();
        msg.ack()
    }
}