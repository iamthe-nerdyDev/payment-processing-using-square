import { NextFunction, Request, Response } from 'express';

export default function catchAsync(fn: (...args: any) => any) {
    const errorHandler = (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };

    return errorHandler;
}
