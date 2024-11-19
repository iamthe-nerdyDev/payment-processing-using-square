import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { SessionRepo, UserRepo } from '../repos';
import { Card } from '../models';

const sessionRepo = new SessionRepo();
const userRepo = new UserRepo();

async function setResponseLocals(res: Response, data: { user_id: number; session_id: number }) {
    const user = await userRepo.Model.findByPk(data.user_id, {
        include: {
            model: Card,
        },
    });

    if (!user) return;

    res.locals.user = user.toJSON() as any;
    res.locals.session_id = data.session_id;
}

export default async function (req: Request, res: Response, next: NextFunction) {
    const accessToken = get(req.headers, 'authorization', '').replace(/^Bearer\s/, '');
    const refreshToken = get(req.headers, 'x-refresh');

    if (!accessToken) return next();
    const { decoded, expired } = sessionRepo.verifyJWT(accessToken);

    if (decoded) {
        await setResponseLocals(res, decoded.data);
        return next();
    }

    if (expired && refreshToken) {
        const newAccessToken = await sessionRepo.reIssueAccessToken(refreshToken as string);

        if (typeof newAccessToken == 'string') {
            res.setHeader('x-access-token', newAccessToken);

            const result = sessionRepo.verifyJWT(newAccessToken as string);
            if (result.decoded) await setResponseLocals(res, result.decoded.data);
        }

        return next();
    }

    return next();
}
