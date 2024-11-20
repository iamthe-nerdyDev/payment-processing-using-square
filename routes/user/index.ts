import { Router } from 'express';
import { RoutesBase } from '../../shared/helpers/routes.base';
import { UserController } from '../../controllers';
import validateSchema from '../../middlewares/validateSchema';
import catchAsync from '../../shared/catchAsync';
import isAuthorized from '../../middlewares/isAuthorized';
import { z } from 'zod';

export default class UserRouter extends RoutesBase<UserController> {
    constructor(router: Router, controller: UserController) {
        super(router, '/user');
        this.handle(controller);
    }

    public handle(controller: UserController): void {
        /**
         * @swagger
         * '/v1/user/whoami':
         *  get:
         *      tags:
         *      - User
         *      summary: retrieves logged in user information
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
         *                                  $ref: '#/components/schemas/UserSchema'
         *          403:
         *              description: Forbidden
         */
        this.router.get(
            `${this.path}/whoami`,
            isAuthorized,
            catchAsync(controller.whoami.bind(controller))
        );

        /**
         * @swagger
         * '/v1/user/signin':
         *  post:
         *      tags:
         *      - User
         *      summary: log in to an existing account
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      $ref: '#/components/schemas/SignInSchema'
         *      responses:
         *          200:
         *              description: Ok
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/AuthorizationTokensSchema'
         *          400:
         *              description: Bad request
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         *          409:
         *              description: Conflict
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         */
        this.router.post(
            `${this.path}/signin`,
            validateSchema(
                z.object({
                    body: z.strictObject({
                        emailAddress: z.string().email(),
                        password: z.string().min(7),
                    }),
                })
            ),
            catchAsync(controller.signinHandler.bind(controller))
        );

        /**
         * @swagger
         * '/v1/user/signup':
         *  post:
         *      tags:
         *      - User
         *      summary: create a new account
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      $ref: '#/components/schemas/SignUpSchema'
         *      responses:
         *          201:
         *              description: Created
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/AuthorizationTokensSchema'
         *          400:
         *              description: Bad request
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         *          409:
         *              description: Conflict
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         */
        this.router.post(
            `${this.path}/signup`,
            validateSchema(
                z.object({
                    body: z
                        .strictObject({
                            firstName: z.string().min(3),
                            lastName: z.string().min(3),
                            emailAddress: z.string().email(),
                            password: z.string().min(7),
                            confirmPassword: z.string().min(7),
                        })
                        .refine((data) => data.password === data.confirmPassword, {
                            message: "Passwords don't match",
                            path: ['confirmPassword'],
                        }),
                })
            ),
            catchAsync(controller.signupHandler.bind(controller))
        );

        /**
         * @swagger
         * '/v1/user/payments':
         *  get:
         *      tags:
         *      - User
         *      summary: retrieves all user payments
         *      parameters:
         *          -   name: limit
         *              in: query
         *              required: false
         *              schema:
         *                  type: number
         *          -   name: page
         *              in: query
         *              required: false
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
         *                                  type: array
         *                                  items:
         *                                      $ref: '#/components/schemas/PaymentSchema'
         *                              pagination:
         *                                  $ref: '#/components/schemas/PaginationSchema'
         *          403:
         *              description: Forbidden
         *          400:
         *              description: Bad request
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         */
        this.router.get(
            `${this.path}/payments`,
            isAuthorized,
            validateSchema(
                z.object({
                    query: z.object({
                        limit: z.string().optional(),
                        page: z.string().optional(),
                    }),
                })
            ),
            catchAsync(controller.getUserPayemtsHandler.bind(controller))
        );

        /**
         * @swagger
         * '/v1/user/cards':
         *  get:
         *      tags:
         *      - User
         *      summary: retrieves all user cards
         *      parameters:
         *          -   name: limit
         *              in: query
         *              required: false
         *              schema:
         *                  type: number
         *          -   name: page
         *              in: query
         *              required: false
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
         *                                  type: array
         *                                  items:
         *                                      $ref: '#/components/schemas/CardSchema'
         *                              pagination:
         *                                  $ref: '#/components/schemas/PaginationSchema'
         *          403:
         *              description: Forbidden
         *          400:
         *              description: Bad request
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/ErrorSchema'
         */
        this.router.get(
            `${this.path}/cards`,
            isAuthorized,
            validateSchema(
                z.object({
                    query: z.object({
                        limit: z.string().optional(),
                        page: z.string().optional(),
                    }),
                })
            ),
            catchAsync(controller.getUserCardsHandler.bind(controller))
        );
    }
}
