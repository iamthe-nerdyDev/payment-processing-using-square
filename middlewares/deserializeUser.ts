import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { Card } from '../models';
import baseRepo from '../repos';

async function setResponseLocals(res: Response, data: { user_id: number; session_id: number }) {
    const user = await baseRepo.user.Model.findByPk(data.user_id, {
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
    const { decoded, expired } = baseRepo.session.verifyJWT(accessToken);

    if (decoded) {
        await setResponseLocals(res, decoded.data);
        return next();
    }

    if (expired && refreshToken) {
        const newAccessToken = await baseRepo.session.reIssueAccessToken(refreshToken as string);

        if (typeof newAccessToken == 'string') {
            res.setHeader('x-access-token', newAccessToken);

            const result = baseRepo.session.verifyJWT(newAccessToken as string);
            if (result.decoded) await setResponseLocals(res, result.decoded.data);
        }

        return next();
    }

    return next();
}
