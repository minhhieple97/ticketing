import { NextFunction } from 'express';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    NotFoundError,
    requireAuth,
    NotAuthorized
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
            if (ticket.userId !== req.currentUser!.id) {
                throw new NotAuthorized()
            }
            await ticket.set({
                title: req.body.title,
                price: req.body.price
            }).save()
            res.send(ticket);
        } catch (error) {
            next(error)
        }

    }
);

export { router as updateTicketRouter };
