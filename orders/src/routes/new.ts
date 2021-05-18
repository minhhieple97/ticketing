import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "./../events/publishers/order-created-publisher";
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validatorRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@lmhticket/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
const router = express.Router();
router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validatorRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket already reserved.");
    }

    // Calculate an expiration date for this order (15 minute)
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * 60);
    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    const result = await order.save();
    // Publish an event saying that an order was created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: OrderStatus.Created,
      userId: order.userId,
      version: result.version,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(result);
  }
);

export { router as newOrderRouter };
