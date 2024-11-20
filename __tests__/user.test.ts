import supertest from 'supertest';
import bcryptjs from 'bcryptjs';
import createApp from '../api';
import { user } from '../shared/informations.test.json';
import { omit } from 'lodash';
import baseRepo from '../repos';

const app = createApp();
const jwt = baseRepo.session.signJWT({ data: { user_id: user.id } }, 'access');
const userObject = {
    ...user,
    password: bcryptjs.hashSync(user.password, 10),
    toJSON: () => ({ ...user, password: bcryptjs.hashSync(user.password, 10) }),
};

describe('User: Integration', () => {
    describe('/v1/user/whoami - Get user information', () => {
        describe('Given the user is not logged in', () => {
            it('Should return a 403 error', async () => {
                const { statusCode } = await supertest(app).get('/v1/user/whoami');
                expect(statusCode).toBe(403);
            });
        });

        describe('Given the user is logged in', () => {
            it('Should return a 200 status and user information', async () => {
                const findByPkMock = jest
                    .spyOn(baseRepo.user.Model, 'findByPk')
                    //@ts-ignore
                    .mockReturnValueOnce(userObject);

                const { statusCode, body } = await supertest(app)
                    .get('/v1/user/whoami')
                    .set('Authorization', `Bearer ${jwt}`);

                expect(findByPkMock).toHaveBeenCalled();
                expect(statusCode).toBe(200);
                expect(body.status).toBe(true);
            });
        });
    });

    describe('/v1/user/signin - Sign user in', () => {
        describe('Given a bad email format', () => {
            it('Should return a 400 error', async () => {
                const { statusCode } = await supertest(app)
                    .post('/v1/user/signin')
                    .send({ emailAddress: 'bad@email', password: '1234567' });

                expect(statusCode).toBe(400);
            });
        });

        describe('Given a nonexistent email address', () => {
            it('Should return a 409 error', async () => {
                const { statusCode } = await supertest(app)
                    .post('/v1/user/signin')
                    .send({ emailAddress: 'nonexistent@email.com', password: user.password });

                expect(statusCode).toBe(409);
            });
        });

        describe('Given the correct credentials', () => {
            it('Should return a 200 status and access tokens', async () => {
                const findOneMock = jest
                    .spyOn(baseRepo.user.Model, 'findOne')
                    //@ts-ignore
                    .mockReturnValueOnce(userObject);

                const newSessionMock = jest
                    .spyOn(baseRepo.session, 'newSession')
                    //@ts-ignore
                    .mockReturnValueOnce({ id: 10 });

                const { statusCode, body } = await supertest(app)
                    .post('/v1/user/signin')
                    .send({ emailAddress: user.emailAddress, password: user.password });

                expect(statusCode).toBe(200);
                expect(findOneMock).toHaveBeenCalledWith({
                    where: { emailAddress: user.emailAddress },
                });
                expect(newSessionMock).toHaveBeenCalled();
                expect(body).toEqual({
                    status: true,
                    message: expect.any(String),
                    data: {
                        tokens: {
                            access_token: expect.any(String),
                            refresh_token: expect.any(String),
                        },
                    },
                });
            });
        });
    });

    describe('/v1/user/signup - Create account for user', () => {
        describe('Given that one or more fields is missing', () => {
            it('Should return a 400 error', async () => {
                const { statusCode } = await supertest(app).post('/v1/user/signup').send({});
                expect(statusCode).toBe(400);
            });
        });

        describe('Given that passwords does not match', () => {
            it('Should return 400 error', async () => {
                const { statusCode } = await supertest(app)
                    .post('/v1/user/signup')
                    .send({ ...omit(user, ['id']), confirmPassword: 'something way different' });

                expect(statusCode).toBe(400);
            });
        });

        describe('Given email address already exist', () => {
            it('Should return a 409 error', async () => {
                const countMock = jest
                    .spyOn(baseRepo.user.Model, 'count')
                    //@ts-ignore
                    .mockReturnValueOnce(1);

                const { statusCode } = await supertest(app)
                    .post('/v1/user/signup')
                    .send({ ...omit(user, ['id', 'cards']), confirmPassword: user.password });

                expect(countMock).toHaveBeenCalled();
                expect(statusCode).toBe(409);
            });
        });

        describe('Given the needed information are provided', () => {
            it('Should create the user and return access tokens', async () => {
                const newSessionMock = jest
                    .spyOn(baseRepo.session, 'newSession')
                    .mockReturnValueOnce({
                        //@ts-ignore
                        id: 1,
                    });

                const createUserMockFn = jest
                    .spyOn(baseRepo.user, 'createUser')
                    //@ts-ignore
                    .mockReturnValueOnce({ id: 1, ...omit(user, ['password']) });

                const { statusCode, body } = await supertest(app)
                    .post('/v1/user/signup')
                    .send({ ...omit(user, ['id', 'cards']), confirmPassword: user.password });

                expect(statusCode).toBe(201);
                expect(body.status).toBe(true);
                expect(newSessionMock).toHaveBeenCalled();

                expect(createUserMockFn).toHaveBeenCalledWith({
                    ...omit(user, ['id', 'cards']),
                });

                expect(body).toEqual({
                    status: true,
                    message: expect.any(String),
                    data: {
                        tokens: {
                            access_token: expect.any(String),
                            refresh_token: expect.any(String),
                        },
                    },
                });
            });
        });
    });

    describe('/v1/user/payments - Get user payments', () => {
        describe('Given the user is not logged in', () => {
            it('Should return a 403 error', async () => {
                const { statusCode } = await supertest(app).get('/v1/user/payments');
                expect(statusCode).toBe(403);
            });
        });

        describe('Given the user is logged in', () => {
            it('Should return a 200 status and user payment history', async () => {
                const findByPkMock = jest
                    .spyOn(baseRepo.user.Model, 'findByPk')
                    //@ts-ignore
                    .mockReturnValueOnce(userObject);

                const { statusCode, body } = await supertest(app)
                    .get('/v1/user/payments')
                    .set('Authorization', `Bearer ${jwt}`);

                expect(findByPkMock).toHaveBeenCalled();
                expect(statusCode).toBe(200);
                expect(body.status).toBe(true);
            });
        });
    });

    describe('/v1/user/cards - Get user cards', () => {
        describe('Given the user is not logged in', () => {
            it('Should return a 403 error', async () => {
                const { statusCode } = await supertest(app).get('/v1/user/cards');
                expect(statusCode).toBe(403);
            });
        });

        describe('Given the user is logged in', () => {
            it('Should return a 200 status and user saved card/s', async () => {
                const findByPkMock = jest
                    .spyOn(baseRepo.user.Model, 'findByPk')
                    //@ts-ignore
                    .mockReturnValueOnce(userObject);

                const { statusCode, body } = await supertest(app)
                    .get('/v1/user/cards')
                    .set('Authorization', `Bearer ${jwt}`);

                expect(findByPkMock).toHaveBeenCalled();
                expect(statusCode).toBe(200);
                expect(body.status).toBe(true);
            });
        });
    });
});
