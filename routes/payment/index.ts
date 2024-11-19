import { Router } from 'express';
import { RoutesBase } from '../../shared/helpers/routes.base';
import { PaymentController } from '../../controllers';
import isAuthorized from '../../middlewares/isAuthorized';
import catchAsync from '../../shared/catchAsync';
import validateSchema from '../../middlewares/validateSchema';
import { z } from 'zod';

export default class PaymentRouter extends RoutesBase<PaymentController> {
    constructor(router: Router, controller: PaymentController) {
        super(router, '/payment');
        this.handle(controller);
    }

    public handle(controller: PaymentController): void {
        /**
         * @swagger
         * '/v1/payment/init':
         *  post:
         *      tags:
         *      - Payment
         *      summary: initializes a payment
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      $ref: '#/components/schemas/InitPaymentSchema'
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
         *                                  $ref: '#/components/schemas/PaymentSchema'
         *          403:
         *              description: Forbidden
         *          400:
         *              description: Bad Request
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         *          404:
         *              description: Not Found
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         */
        this.router.post(
            `${this.path}/init`,
            isAuthorized,
            validateSchema(
                z.object({
                    body: z.strictObject({
                        cardId: z.number(),
                        amount: z.number().gte(1),
                        currency: z.enum(['USD', 'EUR']),
                    }),
                })
            ),
            catchAsync(controller.initPaymentHandler.bind(controller))
        );

        /**
         * @swagger
         * '/v1/payment/debit/{reference}':
         *  post:
         *      tags:
         *      - Payment
         *      summary: debits card attached to a payment
         *      parameters:
         *          -   name: reference
         *              in: path
         *              required: true
         *              schema:
         *                  type: string
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
         *                                  $ref: '#/components/schemas/PaymentSchema'
         *          403:
         *              description: Forbidden
         *          400:
         *              description: Bad Request
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         *          404:
         *              description: Not Found
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         */
        this.router.post(
            `${this.path}/debit/:reference`,
            isAuthorized,
            catchAsync(controller.debitCardHandler.bind(controller))
        );

        /**
         * @swagger
         * '/v1/payment/{paymentId}':
         *  get:
         *      tags:
         *      - Payment
         *      summary: retrieves information about payment
         *      parameters:
         *          -   name: paymentId
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
         *                                  $ref: '#/components/schemas/PaymentSchema'
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
            `${this.path}/:paymentId`,
            isAuthorized,
            catchAsync(controller.getPaymentHandler.bind(controller))
        );

        /**
         * @swagger
         * '/v1/payment/cancel/{paymentId}':
         *  delete:
         *      tags:
         *      - Payment
         *      summary: cancels an initiated payment
         *      parameters:
         *          -   name: paymentId
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
         *                                  $ref: '#/components/schemas/PaymentSchema'
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
            `${this.path}/cancel/:paymentId`,
            isAuthorized,
            catchAsync(controller.cancelPaymentHandler.bind(controller))
        );
    }
}
