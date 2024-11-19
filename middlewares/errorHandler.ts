import { NextFunction, Request, Response } from 'express';
import ApplicationError from '../shared/helpers/applicationError';
import Env from '../shared/env';
import Logger from '../shared/helpers/logger';
import { ApiError } from 'square';

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err.name === 'JsonWebTokenError') {
        err = new ApplicationError('Invalid authorization token', 401);
    }

    if (['SequelizeUniqueConstraintError', 'SequelizeValidationError'].includes(err.name)) {
        err = new ApplicationError((err as any).errors[0].message, 400);
    }

    if (err instanceof ApiError) {
        err = new ApplicationError(err.errors?.[0].detail || err.message, 400);
    }

    const isOperational = 'isOperational' in err ? err.isOperational : false;
    const statusCode = 'statusCode' in err ? (err.statusCode as number) : 500;
    const errorType =
        'errorType' in err
            ? err.errorType
            : statusCode.toString().startsWith('4')
            ? 'client error'
            : 'server error';

    const message = err.message;
    const stack = err.stack;

    if (Env.IS_PROD) {
        if (isOperational) {
            return res.status(statusCode).json({
                status: false,
                error: {
                    type: errorType,
                    message,
                },
            });
        }

        Logger.error('Error occured');
        Logger.error({ name: err.name, message, stack });

        return res.status(500).json({
            status: false,
            error: {
                type: 'server error',
                message: 'Something went wrong. Our engineers are on it',
            },
        });
    }

    res.status(statusCode).json({
        status: false,
        error: {
            type: errorType,
            message,
            stack,
        },
    });
}
