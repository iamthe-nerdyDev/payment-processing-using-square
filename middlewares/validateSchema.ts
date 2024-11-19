import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import ApplicationError from '../shared/helpers/applicationError';

const validateSchema =
    (schema: AnyZodObject) => (req: Request, _: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            next();
        } catch (e: any) {
            if (e instanceof ZodError) {
                const errors = e.errors.map(
                    (issue: any) => `${issue.path.join('.')}: ${issue.message}`
                );

                throw new ApplicationError(errors[0], 400);
            }
        }
    };

export default validateSchema;
