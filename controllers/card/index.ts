import { Request, Response } from 'express';
import ApplicationError from '../../shared/helpers/applicationError';
import { omit } from 'lodash';
import { Payment } from '../../models';
import baseRepo from '../../repos';

export default class CardController {
    constructor(private repo = baseRepo) {}

    async addCardHandler(req: Request, res: Response) {
        const { cardToken, verificationToken, cardholderName } = req.body;
        const { user } = res.locals;

        const card = await this.repo.card.createCard(
            cardToken,
            cardholderName,
            verificationToken,
            user!
        );

        return res.status(201).json({
            status: true,
            message: 'Card added!',
            data: omit(card.toJSON(), [
                'metadata',
                'verificationToken',
                'userId',
                'squareCardId',
                'deletedAt',
            ]),
        });
    }

    async getCardHandler(req: Request, res: Response) {
        const { cardId } = req.params;
        const { user } = res.locals;

        if (!user?.cards.some((card) => card.id === Number(cardId))) {
            throw new ApplicationError('Card not found', 404);
        }

        const card = await this.repo.card.Model.findByPk(Number(cardId), {
            include: {
                model: Payment,
                attributes: {
                    exclude: ['userId', 'cardId', 'squarePaymentId', 'metadata', 'deletedAt'],
                },
            },
            attributes: {
                exclude: ['metadata', 'userId', 'verificationToken', 'squareCardId', 'deletedAt'],
            },
        });

        if (!card) throw new ApplicationError('Card not found!', 404);

        return res.status(200).json({
            status: true,
            message: 'Card retrieved!',
            data: card.toJSON(),
        });
    }

    async disableCardHandler(req: Request, res: Response) {
        const { cardId } = req.params;
        const { user } = res.locals;

        if (!user?.cards.some((card) => card.id === Number(cardId))) {
            throw new ApplicationError('Card not found', 404);
        }

        const card = await this.repo.card.disableCard(Number(cardId));
        return res.status(200).json({
            status: true,
            message: 'Card disabled!',
            data: omit(card.toJSON(), [
                'metadata',
                'verificationToken',
                'userId',
                'squareCardId',
                'deletedAt',
            ]),
        });
    }
}
