import { Publisher, Subjects, TicketCreatedEvent, } from "@lmhticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
