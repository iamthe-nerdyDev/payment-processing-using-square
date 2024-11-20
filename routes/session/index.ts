import { Router } from 'express';
import { RoutesBase } from '../../shared/helpers/routes.base';
import { SessionController } from '../../controllers';
import isAuthorized from '../../middlewares/isAuthorized';
import catchAsync from '../../shared/catchAsync';

export default class SessionRouter extends RoutesBase<SessionController> {
    constructor(router: Router, controller: SessionController) {
        super(router, '/session');
        this.handle(controller);
    }

    public handle(controller: SessionController): void {
        /**
         * @swagger
         * '/v1/session':
         *  get:
         *      tags:
         *      - Session
         *      summary: retrieves info about current session
         *      responses:
         *          200:
         *              description: Ok
         *              content:
         *                  application/json:
         *                      schema:
         *                          type: object
         *                          properties:
         *                              status:
         *                                  type: boolean
         *                              message:
         *                                  type: string
         *                              data:
         *                                  $ref: '#/components/schemas/SessionSchema'
         *          403:
         *              description: Forbidden
         */
        this.router.get(
            `${this.path}`,
            isAuthorized,
            catchAsync(controller.getCurrentSessionInfoHandler.bind(controller))
        );

        /**
         * @swagger
         * '/v1/session':
         *  delete:
         *      tags:
         *      - Session
         *      summary: destroys current session
         *      responses:
         *          200:
         *              description: Ok
         *              content:
         *                  application/json:
         *                      schema:
         *                          type: object
         *                          properties:
         *                              status:
         *                                  type: boolean
         *                              message:
         *                                  type: string
         *          403:
         *              description: Forbidden
         */
        this.router.delete(
            `${this.path}`,
            isAuthorized,
            catchAsync(controller.logoutHandler.bind(controller))
        );
    }
}
