import { Subjects, Publisher, PaymentCreatedEvent } from '@lmhticket/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
