import { Request, Response } from 'express';
import { PaymentRepo } from '../../repos';
import { omit } from 'lodash';
import { Card, User } from '../../models';
import ApplicationError from '../../shared/helpers/applicationError';

export default class PaymentController {
    constructor(private paymentRepo = new PaymentRepo()) {}

    async initPaymentHandler(req: Request, res: Response) {
        const { user } = res.locals;
        const { cardId, currency, amount } = req.body;

        const card = user?.cards.find((card) => card.id === Number(cardId));

        if (!card) throw new ApplicationError('Card not found', 404);
        if (!card.enabled) throw new ApplicationError('Card not enabled', 400);

        const payment = await this.paymentRepo.initPayment({
            cardId,
            currency,
            amount,
            userId: user?.id!,
        });

        return res.status(201).json({
            status: true,
            message: 'Payment initiated!',
            data: omit(payment.toJSON(), ['userId', 'squarePaymentId', 'metadata', 'deletedAt']),
        });
    }

    async debitCardHandler(req: Request, res: Response) {
        const { reference } = req.params;
        const { user } = res.locals;

        const payment = await this.paymentRepo.Model.findOne({
            where: { reference },
            include: [{ model: Card }, { model: User }],
        });

        if (!payment) throw new ApplicationError('Payment not found', 404);
        if (payment.userId !== user?.id) return res.sendStatus(403);

        if (payment.status !== 'initiated') {
            throw new ApplicationError(
                'Only payments with status="initiated" can be processed',
                400
            );
        }

        const response = await this.paymentRepo.debitCard(payment);
        return res.status(200).json({
            status: true,
            message: 'Card debitted!',
            data: omit(response.toJSON(), [
                'userId',
                'cardId',
                'squarePaymentId',
                'metadata',
                'deletedAt',
            ]),
        });
    }

    async getPaymentHandler(req: Request, res: Response) {
        const { paymentId } = req.params;
        const { user } = res.locals;

        const payment = await this.paymentRepo.Model.findByPk(Number(paymentId), {
            include: {
                model: Card,
                attributes: {
                    exclude: [
                        'metadata',
                        'verificationToken',
                        'userId',
                        'squareCardId',
                        'deletedAt',
                    ],
                },
            },
        });

        if (!payment) throw new ApplicationError('Payment not found', 404);
        if (payment.userId !== user?.id) return res.sendStatus(403);

        return res.status(200).json({
            status: true,
            message: 'Payment retrieved!',
            data: omit(payment.toJSON(), [
                'userId',
                'cardId',
                'squarePaymentId',
                'metadata',
                'deletedAt',
            ]),
        });
    }

    async cancelPaymentHandler(req: Request, res: Response) {
        const { paymentId } = req.params;
        const { user } = res.locals;

        const payment = await this.paymentRepo.Model.findByPk(Number(paymentId));
        if (!payment) throw new ApplicationError('Payment not found', 404);
        if (payment.userId !== user?.id) return res.sendStatus(403);

        if (payment.status !== 'initiated') {
            throw new ApplicationError(
                'Only payments with status="initiated" can be cancelled',
                400
            );
        }

        await payment.update({ status: 'cancelled' });

        return res.status(200).json({
            status: true,
            message: 'Payment updated!',
            data: omit(payment.toJSON(), [
                'userId',
                'cardId',
                'squarePaymentId',
                'metadata',
                'deletedAt',
            ]),
        });
    }
}
