import { Subjects } from '@lmhticket/common';
import { Publisher, OrderCreatedEvent } from '@lmhticket/common';
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}