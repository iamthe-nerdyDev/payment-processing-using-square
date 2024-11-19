import crypto from 'crypto';
import { Card } from '../../models';
import square from '../../shared/adapters/square';
import ApplicationError from '../../shared/helpers/applicationError';
import common from '../../shared/common';
import { UserOuput } from '../../models/user';

export default class CardRepo {
    constructor(public Model = Card) {}

    async createCard(
        cardToken: string,
        cardholderName: string,
        verificationToken: string,
        user: UserOuput
    ) {
        const createCardResponse = await square.cardsApi.createCard({
            idempotencyKey: crypto.randomUUID(),
            sourceId: cardToken,
            verificationToken,
            card: { cardholderName, customerId: user?.squareCustomerId },
        });

        const card = createCardResponse.result.card;
        if (!card) {
            throw new ApplicationError('Could not get card information from thirdparty', 409);
        }

        return await this.Model.create({
            squareCardId: card.id!,
            verificationToken,
            userId: user.id,
            last4: card.last4!,
            cardholderName: card.cardholderName!,
            cardBrand: card.cardBrand!,
            cardType: card.cardType!,
            enabled: card.enabled!,
            expMonth: Number(card.expMonth),
            expYear: Number(card.expYear),
            metadata: common.toMetadata(card),
        });
    }

    async disableCard(id: number) {
        const card = await this.Model.findByPk(id);
        if (!card) throw new ApplicationError('Card not found', 404);

        const { result: respone } = await square.cardsApi.disableCard(card.squareCardId);

        await card.update({
            enabled: respone.card?.enabled || false,
            metadata: common.toMetadata(respone.card || {}),
        });

        return card;
    }
}
