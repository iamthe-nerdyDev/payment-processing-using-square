import { Router } from 'express';
import { RoutesBase } from '../../shared/helpers/routes.base';
import { CardController } from '../../controllers';
import isAuthorized from '../../middlewares/isAuthorized';
import catchAsync from '../../shared/catchAsync';
import validateSchema from '../../middlewares/validateSchema';
import { z } from 'zod';

export default class CardRouter extends RoutesBase<CardController> {
    constructor(router: Router, controller: CardController) {
        super(router, '/card');
        this.handle(controller);
    }

    public handle(controller: CardController): void {
        /**
         * @swagger
         * '/v1/card':
         *  post:
         *      tags:
         *      - Card
         *      summary: adds card to user profile
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      $ref: '#/components/schemas/AddCardSchema'
         *      responses:
         *          201:
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
         *                                  $ref: '#/components/schemas/CardSchema'
         *          403:
         *              description: Forbidden
         *          400:
         *              description: Bad Request
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         */
        this.router.post(
            `${this.path}`,
            isAuthorized,
            validateSchema(
                z.object({
                    body: z.strictObject({
                        cardToken: z.string(),
                        verificationToken: z.string(),
                        cardholderName: z.string(),
                    }),
                })
            ),
            catchAsync(controller.addCardHandler.bind(controller))
        );

        /**
         * @swagger
         * '/v1/card/{cardId}':
         *  get:
         *      tags:
         *      - Card
         *      summary: retrieves a single card
         *      parameters:
         *          -   name: cardId
         *              in: path
         *              required: true
         *              schema:
         *                  type: number
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
         *                                  $ref: '#/components/schemas/CardSchemaWithPayment'
         *          403:
         *              description: Forbidden
         *          404:
         *              description: Not Found
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         */
        this.router.get(
            `${this.path}/:cardId`,
            isAuthorized,
            catchAsync(controller.getCardHandler.bind(controller))
        );

        /**
         * @swagger
         * '/v1/card/{cardId}':
         *  delete:
         *      tags:
         *      - Card
         *      summary: disable a card
         *      parameters:
         *          -   name: cardId
         *              in: path
         *              required: true
         *              schema:
         *                  type: number
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
         *                                  $ref: '#/components/schemas/CardSchema'
         *          403:
         *              description: Forbidden
         *          404:
         *              description: Not Found
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         */
        this.router.delete(
            `${this.path}/:cardId`,
            isAuthorized,
            catchAsync(controller.disableCardHandler.bind(controller))
        );
    }
}
