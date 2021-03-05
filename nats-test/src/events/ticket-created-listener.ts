import { TicketCreatedEvent } from './ticket-created-events';
import { Subjects } from './subjects';
import { Message } from 'node-nats-streaming';
import Listener from "./base-listener";
export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payment-service';
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data!', data);
        msg.ack()
    }
}