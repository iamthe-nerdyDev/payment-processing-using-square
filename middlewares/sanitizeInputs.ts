import { NextFunction, Request, Response } from 'express';
import common from '../shared/common';

export default function sanitizeInput(req: Request, _: Response, next: NextFunction) {
    req.body = common.cleanObject(req.body);
    req.params = common.cleanObject(req.params);
    req.query = common.cleanObject(req.query);

    return next();
}
