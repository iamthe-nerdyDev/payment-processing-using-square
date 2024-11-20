import supertest from 'supertest';
import createApp from '../api';
import baseRepo from '../repos';
import { user } from '../shared/informations.test.json';
import { omit } from 'lodash';

const app = createApp();
const jwt = baseRepo.session.signJWT({ data: { user_id: user.id } }, 'access');
const userObject = {
    ...user,
    toJSON: () => ({ ...user }),
};

describe('Card: Integration', () => {
    describe('/v1/card - Add card to user profile', () => {
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
                        .post('/v1/card')
                        .set('Authorization', `Bearer ${jwt}`)
                        .send({});

                    expect(statusCode).toBe(400);
                });
            });

            describe('... and required fields are provided', () => {
                it('Should return a 201 status and information about the card', async () => {
                    const payload = {
                        cardToken: 'cnon:card-ok',
                        verificationToken: 'verf:token',
                        cardholderName: 'John Doe',
                    };

                    const createCardMock = jest
                        .spyOn(baseRepo.card, 'createCard')
                        .mockReturnValueOnce({
                            //@ts-ignore
                            toJSON: () => ({ id: 1, ...omit(payload, ['verificationToken']) }),
                        });

                    const { statusCode, body } = await supertest(app)
                        .post('/v1/card')
                        .set('Authorization', `Bearer ${jwt}`)
                        .send(payload);

                    expect(statusCode).toBe(201);
                    expect(body.data.id).toBe(1);
                    expect(body.data.cardholderName).toBe(payload.cardholderName);
                    expect(createCardMock).toHaveBeenCalledWith(
                        payload.cardToken,
                        payload.cardholderName,
                        payload.verificationToken,
                        userObject.toJSON()
                    );
                });
            });
        });
    });

    describe('/v1/card/{cardId} - Returns card information', () => {
        describe('Given the user is not logged in', () => {
            it('Should return a 403 error', async () => {
                const { statusCode } = await supertest(app).get(`/v1/card/${user.cards[0].id}`);
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

            describe('... but an invalid {cardId} is supplied', () => {
                it('Should return 404 error', async () => {
                    const { statusCode } = await supertest(app)
                        .get(`/v1/card/${user.cards[0].id + 100}`)
                        .set('Authorization', `Bearer ${jwt}`);

                    expect(statusCode).toBe(404);
                });
            });

            describe('... and a valid {cardId} is provided', () => {
                it('Should return a 200 status and information about the card', async () => {
                    const findByPkMock = jest
                        .spyOn(baseRepo.card.Model, 'findByPk')
                        .mockReturnValueOnce({
                            //@ts-ignore
                            toJSON: () => ({ ...user.cards[0] }),
                        });

                    const { statusCode, body } = await supertest(app)
                        .get(`/v1/card/${user.cards[0].id}`)
                        .set('Authorization', `Bearer ${jwt}`);

                    expect(statusCode).toBe(200);
                    expect(body.data.id).toBe(user.cards[0].id);
                    expect(findByPkMock).toHaveBeenCalled();
                });
            });
        });
    });

    describe('/v1/card/{cardId} - Deactivates user card', () => {
        describe('Given the user is not logged in', () => {
            it('Should return a 403 error', async () => {
                const { statusCode } = await supertest(app).delete(`/v1/card/${user.cards[0].id}`);
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

            describe('... but an invalid {cardId} is supplied', () => {
                it('Should return 404 error', async () => {
                    const { statusCode } = await supertest(app)
                        .delete(`/v1/card/${user.cards[0].id + 100}`)
                        .set('Authorization', `Bearer ${jwt}`);

                    expect(statusCode).toBe(404);
                });
            });

            describe('... and a valid {cardId} is provided', () => {
                it('Should return a 200 status and information about the card', async () => {
                    const disableCardMock = jest
                        .spyOn(baseRepo.card, 'disableCard')
                        .mockReturnValueOnce({
                            //@ts-ignore
                            toJSON: () => ({ ...user.cards[0] }),
                        });

                    const { statusCode, body } = await supertest(app)
                        .delete(`/v1/card/${user.cards[0].id}`)
                        .set('Authorization', `Bearer ${jwt}`);

                    expect(statusCode).toBe(200);
                    expect(body.data.id).toBe(user.cards[0].id);
                    expect(disableCardMock).toHaveBeenCalledWith(user.cards[0].id);
                });
            });
        });
    });
});
