import { Subjects } from '@lmhticket/common';
import { Publisher, OrderCancelledEvent } from '@lmhticket/common';
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}