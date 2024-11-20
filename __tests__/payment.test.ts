import supertest from 'supertest';
import createApp from '../api';
import baseRepo from '../repos';
import { user } from '../shared/informations.test.json';

const app = createApp();
const jwt = baseRepo.session.signJWT({ data: { user_id: user.id } }, 'access');
const userObject = {
    ...user,
    toJSON: () => ({ ...user }),
};

describe('Payment: Integration', () => {
    describe('/v1/payment/init - Initiates a payment', () => {
        describe('Given the user is not logged in', () => {
            it('Should return a 403 error', async () => {
                const { statusCode } = await supertest(app).post('/v1/card');
                expect(statusCode).toBe(403);
            });
        });

        describe('Given the user is logged in', () => {
            let findByPkMock: any;

            beforeEach(() => {
                findByPkMock = jest
                    .spyOn(baseRepo.user.Model, 'findByPk')
                    //@ts-ignore
                    .mockReturnValueOnce(userObject);
            });

            afterEach(() => {
                expect(findByPkMock).toHaveBeenCalled();
            });

            describe('... and required fields are missing', () => {
                it('Should return 400 error', async () => {
                    const { statusCode } = await supertest(app)
                        .post('/v1/payment/init')
                        .set('Authorization', `Bearer ${jwt}`)
                        .send({});

                    expect(statusCode).toBe(400);
                });
            });

            describe('... and required fields are provided', () => {
                it('Should return a 201 status and information about the card', async () => {
                    const payload = {
                        cardId: user.cards[0].id,
                        amount: 1,
                        currency: 'USD',
                    };

                    const initPaymentMock = jest
                        .spyOn(baseRepo.payment, 'initPayment')
                        .mockReturnValueOnce({
                            //@ts-ignore
                            toJSON: () => ({ id: 1, ...payload }),
                        });

                    const { statusCode, body } = await supertest(app)
                        .post('/v1/payment/init')
                        .set('Authorization', `Bearer ${jwt}`)
                        .send(payload);

                    expect(statusCode).toBe(201);
                    expect(body.data.id).toBe(1);
                    expect(body.data.cardId).toBe(payload.cardId);
                    expect(initPaymentMock).toHaveBeenCalledWith({ ...payload, userId: user.id });
                });
            });
        });
    });

    describe('/v1/payment/debit/{reference} - Debits a ', () => {
        const reference = 'random-ref';

        describe('Given the user is not logged in', () => {
            it('Should return a 403 error', async () => {
                const { statusCode } = await supertest(app).post(`/v1/payment/debit/${reference}`);
                expect(statusCode).toBe(403);
            });
        });

        describe('Given the user is logged in', () => {
            let findByPkMock: any;

            beforeEach(() => {
                findByPkMock = jest
                    .spyOn(baseRepo.user.Model, 'findByPk')
                    //@ts-ignore
                    .mockReturnValueOnce(userObject);
            });

            afterEach(() => {
                expect(findByPkMock).toHaveBeenCalled();
            });

            describe('... and an unknown reference is passed', () => {
                it('Should return 404 error', async () => {
                    const { statusCode } = await supertest(app)
                        .post('/v1/payment/debit/unknown-reference')
                        .set('Authorization', `Bearer ${jwt}`)
                        .send({});

                    expect(statusCode).toBe(404);
                });
            });

            describe('... and payment status != "initiated"', () => {
                it('Should return a 400 error', async () => {
                    const payment = {
                        cardId: user.cards[0].id,
                        userId: user.id,
                        status: 'failed',
                        amount: 1,
                        currency: 'USD',
                    };

                    const findOneMock = jest
                        .spyOn(baseRepo.payment.Model, 'findOne')
                        .mockReturnValueOnce({
                            id: 1,
                            ...payment,
                            //@ts-ignore
                            toJSON: () => ({ id: 1, ...payment }),
                        });

                    const { statusCode } = await supertest(app)
                        .post(`/v1/payment/debit/${reference}`)
                        .set('Authorization', `Bearer ${jwt}`)
                        .send({});

                    expect(statusCode).toBe(400);
                    expect(findOneMock).toHaveBeenCalled();
                });
            });

            describe('... and payment status = "initiated"', () => {
                it('Should return a 200 status and information about the payment', async () => {
                    const payment = {
                        cardId: user.cards[0].id,
                        userId: user.id,
                        status: 'initiated',
                        amount: 1,
                        currency: 'USD',
                    };

                    const findOneMock = jest
                        .spyOn(baseRepo.payment.Model, 'findOne')
                        .mockReturnValueOnce({
                            id: 1,
                            ...payment,
                            //@ts-ignore
                            toJSON: () => ({ id: 1, ...payment }),
                        });

                    const debitCardMock = jest
                        .spyOn(baseRepo.payment, 'debitCard')
                        .mockReturnValueOnce({
                            id: 1,
                            ...payment,
                            //@ts-ignore
                            status: 'successful',
                            toJSON: () => ({ id: 1, ...payment, status: 'successful' }),
                        });

                    const { statusCode, body } = await supertest(app)
                        .post(`/v1/payment/debit/${reference}`)
                        .set('Authorization', `Bearer ${jwt}`)
                        .send({});

                    expect(statusCode).toBe(200);
                    expect(body.data.id).toBe(1);
                    expect(findOneMock).toHaveBeenCalled();
                    expect(debitCardMock).toHaveBeenCalled();
                });
            });
        });
    });

    describe('/v1/payment/{paymentId} - Returns payment information', () => {
        describe('Given the user is not logged in', () => {
            it('Should return a 403 error', async () => {
                const { statusCode } = await supertest(app).get('/v1/payment/1');
                expect(statusCode).toBe(403);
            });
        });

        describe('Give the user is logged in', () => {
            let findByPkMock: any;

            beforeEach(() => {
                findByPkMock = jest
                    .spyOn(baseRepo.user.Model, 'findByPk')
                    //@ts-ignore
                    .mockReturnValueOnce(userObject);
            });

            afterEach(() => {
                expect(findByPkMock).toHaveBeenCalled();
            });

            describe('... but an invalid {paymentId} is supplied', () => {
                it('Should return 404 error', async () => {
                    const { statusCode } = await supertest(app)
                        .get('/v1/payment/100')
                        .set('Authorization', `Bearer ${jwt}`);

                    expect(statusCode).toBe(404);
                });
            });

            describe('... and a valid {paymentId} is provided', () => {
                it('Should return a 200 status and information about the payment', async () => {
                    const findByPkMock = jest
                        .spyOn(baseRepo.payment.Model, 'findByPk')
                        .mockReturnValueOnce({
                            //@ts-ignore
                            id: 1,
                            userId: user.id,
                            toJSON: () => ({ id: 1 }),
                        });

                    const { statusCode, body } = await supertest(app)
                        .get(`/v1/payment/1`)
                        .set('Authorization', `Bearer ${jwt}`);

                    expect(statusCode).toBe(200);
                    expect(body.data.id).toBe(1);
                    expect(findByPkMock).toHaveBeenCalled();
                });
            });
        });
    });
});
