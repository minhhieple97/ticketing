import { validatorRequest } from '@lmhticket/common';
import { NotAuthorized, OrderStatus, BadRequestError } from '@lmhticket/common';
import { NotFoundError } from '@lmhticket/common';
import { body } from 'express-validator';
import { requireAuth } from '@lmhticket/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();
router.post(
    '/api/payments',
    requireAuth,
    [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
    validatorRequest,
    async (req: Request, res: Response) => {
        const { orderId, token } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorized();
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an cancelled order');
        }
        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token,
        });
        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        });
        await payment.save()
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })
        res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter }