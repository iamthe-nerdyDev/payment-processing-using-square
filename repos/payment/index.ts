import crypto from 'crypto';
import { Payment } from '../../models';
import { PaymentInput } from '../../models/payment';
import square from '../../shared/adapters/square';
import ApplicationError from '../../shared/helpers/applicationError';
import common from '../../shared/common';
import { customAlphabet } from 'nanoid';
import { ApiError } from 'square';

export default class PaymentRepo {
    constructor(public Model = Payment) {}

    private generateReferenceNumber(length = 10) {
        const alphabets = 'QWERTYUIOPASDFGHJKLZXCVBNM0123456789';
        return customAlphabet(alphabets)(length);
    }

    async initPayment(payload: PaymentInput) {
        return await this.Model.create({
            ...payload,
            status: 'initiated',
            reference: this.generateReferenceNumber(),
        });
    }

    async debitCard(payment: Payment) {
        try {
            const createPaymentResponse = await square.paymentsApi.createPayment({
                sourceId: payment.card.squareCardId,
                idempotencyKey: crypto.randomUUID(),
                // verificationToken: payment.card.verificationToken,
                amountMoney: {
                    amount: BigInt(payment.amount * 100),
                    currency: payment.currency,
                },
                autocomplete: true,
                customerId: payment.user.squareCustomerId,
                locationId: 'LGV49H19WXXJM',
                referenceId: payment.reference,
            });

            const squarePayment = createPaymentResponse.result.payment;
            if (!squarePayment) {
                await payment.update({ status: 'failed' });
                throw new ApplicationError(
                    'Could not get payment information from thirdparty',
                    409
                );
            }

            await payment.update({
                metadata: common.toMetadata(squarePayment),
                status: 'completed',
            });
        } catch (e: any) {
            if (e instanceof ApiError) {
                await payment.update({
                    metadata: common.toMetadata(e.result),
                    status: 'failed',
                });
            }

            throw e;
        }

        return payment;
    }
}
