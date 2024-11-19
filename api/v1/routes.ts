import { Response, Router } from 'express';
import Logger from '../../shared/helpers/logger';
import { CardRouter, PaymentRouter, SessionRouter, UserRouter } from '../../routes';
import {
    CardController,
    PaymentController,
    SessionController,
    UserController,
} from '../../controllers';

function init(router: Router) {
    Logger.info('⌛️ Initializing v1 routes');

    new CardRouter(router, new CardController());
    new UserRouter(router, new UserController());
    new SessionRouter(router, new SessionController());
    new PaymentRouter(router, new PaymentController());
}

const router = Router();
init(router);

/**
 * @swagger
 * '/v1/healthz':
 *  get:
 *     tags:
 *     - Healthcheck
 *     summary: check if v1 endpoint is up and running
 *     responses:
 *       200:
 *         description: Ok
 */
router.get('/healthz', (_, res: Response) => res.sendStatus(200));

export = router;
