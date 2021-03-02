import { NextFunction } from 'express';
import express, { Request, Response } from 'express';
import { NotFoundError, validatorRequest, BadRequestError } from '@lmhticket/common';
import Ticket from '../models/ticket';
import { param } from 'express-validator';
import mongoose from 'mongoose'
const router = express.Router();

router.get('/api/tickets/:id', [param('id').notEmpty()], validatorRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ticketId = req.params.id;
        if (!mongoose.isValidObjectId(ticketId)) {
            throw new BadRequestError("Invalid param");
        }
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            throw new NotFoundError();
        }

        res.status(200).send(ticket);
    } catch (error) {
        next(error)
    }

});

export { router as showTicketRouter };
