import { Request, Response, NextFunction } from 'express';

export default function (_: Request, res: Response, next: NextFunction) {
    if (!res.locals.user) {
        return res.sendStatus(403);
    }

    return next();
}
