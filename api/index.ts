import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import v1Routes from './v1/routes';
import deserializeUser from '../middlewares/deserializeUser';
import errorHandler from '../middlewares/errorHandler';
import catchAsync from '../shared/catchAsync';
import ApplicationError from '../shared/helpers/applicationError';
import sanitizeInput from '../middlewares/sanitizeInputs';
import { version } from '../package.json';

export default function createApp() {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(helmet());

    app.use(
        morgan('combined', {
            stream: fs.createWriteStream(
                path.join(
                    __dirname,
                    '/../logs',
                    `access-${new Date().toISOString().split('T')[0]}.log`
                ),
                { flags: 'a' }
            ),
        })
    );

    app.use(
        cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'Authorization',
                'X-Refresh',
                'cache',
            ],
            exposedHeaders: ['X-Access-Token'],
        })
    );

    const options: swaggerJsDoc.Options = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'Payment processing using Square',
                version,
            },
            servers: [
                {
                    url: 'http://localhost:7777',
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            security: [
                {
                    bearerAuth: [],
                },
            ],
        },
        apis: [
            './api/*.ts',
            './api/v1/*.ts',
            './routes/card/*.ts',
            './routes/payment/*.ts',
            './routes/session/*.ts',
            './routes/user/*.ts',
            './schemas/*.ts',
        ],
    };

    app.use(sanitizeInput);
    app.use(deserializeUser);
    app.use('/v1/', v1Routes);

    /**
     * @swagger
     * '/healthz':
     *  get:
     *     tags:
     *     - Healthcheck
     *     summary: check if the app is up and running
     *     responses:
     *       200:
     *         description: Ok
     */
    app.get('/healthz', (_, res) => res.sendStatus(200));

    const swaggerSpec = swaggerJsDoc(options);
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    app.get('/docs.json', (_, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    app.use(
        '*',
        catchAsync((req) => {
            throw new ApplicationError(`${req.originalUrl} not found on server`, 404);
        })
    );

    app.use(errorHandler);

    return app;
}
