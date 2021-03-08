import { Publisher, Subjects, TicketUpdatedEvent, } from "@lmhticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
