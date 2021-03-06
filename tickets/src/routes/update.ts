import { natsWrapper } from './../nats-wrapper';
import { TicketUpdatedPublisher } from './../events/publishers/ticket-updated-publisher';
import { NextFunction } from 'express';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    NotFoundError,
    requireAuth,
    NotAuthorized,
    BadRequestError
} from '@lmhticket/common';
import Ticket from '../models/ticket';

const router = express.Router();

router.put(
    '/api/tickets/:id',
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be provided and must be greater than 0'),
    ],
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ticket = await Ticket.findById(req.params.id);
            if (!ticket) {
                throw new NotFoundError();
            }
            if (ticket.orderId) {
                throw new BadRequestError('Cannot edit a ticket reserved.')
            }
            if (ticket.userId !== req.currentUser!.id) {
                throw new NotAuthorized()
            }
            await ticket.set({
                title: req.body.title,
                price: req.body.price
            }).save();
            new TicketUpdatedPublisher(natsWrapper.client).publish({
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId,
                version: ticket.version
            })
            res.send(ticket);
        } catch (error) {
            next(error)
        }

    }
);

export { router as updateTicketRouter };
