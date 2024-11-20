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

describe('Session: Integration', () => {
    describe('/v1/session - Returns information about current session', () => {
        describe('Given the user is not logged in', () => {
            it('Should return a 403 error', async () => {
                const { statusCode } = await supertest(app).get('/v1/session');
                expect(statusCode).toBe(403);
            });
        });

        describe('Given the user is logged in', () => {
            it('Should return a 200 status and session information', async () => {
                const findByPkMock = jest
                    .spyOn(baseRepo.user.Model, 'findByPk')
                    //@ts-ignore
                    .mockReturnValueOnce(userObject);

                const { statusCode, body } = await supertest(app)
                    .get('/v1/session')
                    .set('Authorization', `Bearer ${jwt}`);

                expect(findByPkMock).toHaveBeenCalled();
                expect(statusCode).toBe(200);
                expect(body.status).toBe(true);
            });
        });
    });

    describe('/v1/session - Log the user out', () => {
        describe('Given the user is not logged in', () => {
            it('Should return a 403 error', async () => {
                const { statusCode } = await supertest(app).delete('/v1/session');
                expect(statusCode).toBe(403);
            });
        });

        // describe('Given the user is logged in', () => {
        //     it('Should log the user out', async () => {});
        // });
    });
});
