import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import ApplicationError from '../../shared/helpers/applicationError';
import { Card, Payment } from '../../models';
import { get } from 'lodash';
import common from '../../shared/common';
import baseRepo from '../../repos';

export default class UserController {
    constructor(private repo = baseRepo) {}

    async whoami(_: Request, res: Response) {
        const { user: local_user } = res.locals;

        const user = await this.repo.user.Model.findByPk(local_user?.id, {
            include: {
                model: Card,
                attributes: {
                    exclude: [
                        'userId',
                        'verificationToken',
                        'squareCardId',
                        'metadata',
                        'deletedAt',
                    ],
                },
                include: [
                    {
                        model: Payment,
                        attributes: {
                            exclude: [
                                'userId',
                                'cardId',
                                'squarePaymentId',
                                'metadata',
                                'deletedAt',
                            ],
                        },
                    },
                ],
            },
            attributes: {
                exclude: ['password', 'squareCustomerId', 'deletedAt', 'metadata'],
            },
        });

        return res.status(200).json({
            status: true,
            message: 'User retrieved!',
            data: user?.toJSON(),
        });
    }

    async signinHandler(req: Request, res: Response) {
        const payload = req.body;
        payload.emailAddress = payload.emailAddress.toLowerCase();

        const user = await this.repo.user.Model.findOne({
            where: {
                emailAddress: payload.emailAddress,
            },
        });

        if (!user || !bcryptjs.compareSync(payload.password, user.password)) {
            throw new ApplicationError('Incorrect email address or password', 409);
        }

        const session = await this.repo.session.newSession({
            userId: user.id,
            isActive: true,
            ip: common.getIpAddress(req) || null,
            device: req.get('user-agent') || null,
        });

        const jwtPayload = {
            data: { user_id: user.id, session_id: session.id },
        };

        const access_token = this.repo.session.signJWT(jwtPayload, 'access');
        const refresh_token = this.repo.session.signJWT(jwtPayload, 'refresh');

        return res.status(200).json({
            status: true,
            message: 'Logged in successfully!',
            data: { tokens: { access_token, refresh_token } },
        });
    }

    async signupHandler(req: Request, res: Response) {
        const payload = req.body;
        payload.emailAddress = payload.emailAddress.toLowerCase();

        const { emailAddress, password, firstName, lastName } = payload;

        const user = await this.repo.user.createUser({
            emailAddress,
            firstName,
            lastName,
            password,
        });

        const session = await this.repo.session.newSession({
            userId: user.id,
            isActive: true,
            ip: common.getIpAddress(req) || null,
            device: req.get('user-agent') || null,
        });

        const jwtPayload = {
            data: { user_id: user.id, session_id: session.id },
        };

        const access_token = this.repo.session.signJWT(jwtPayload, 'access');
        const refresh_token = this.repo.session.signJWT(jwtPayload, 'refresh');

        return res.status(201).json({
            status: true,
            message: 'Account created successfully!',
            data: { tokens: { access_token, refresh_token } },
        });
    }

    async getUserPayemtsHandler(req: Request, res: Response) {
        const { user } = res.locals;

        const limit = Number(get(req.query, 'limit', '10'));
        const page = Number(get(req.query, 'page', '1'));

        if (isNaN(limit)) throw new ApplicationError('Type of limit is not number', 400);
        if (isNaN(page)) throw new ApplicationError('Type of page is not number', 400);

        const offset = (page - 1) * limit;

        const { rows: payments, count } = await this.repo.payment.Model.findAndCountAll({
            where: {
                userId: user?.id,
            },
            attributes: {
                exclude: ['userId', 'cardId', 'squarePaymentId', 'metadata', 'deletedAt'],
            },
            limit,
            offset,
        });

        return res.status(200).json({
            status: true,
            message: 'User Payment/s retrieved!',
            data: payments,
            pagination: {
                limit,
                currentPage: page,
                offset,
                totalPages: Math.ceil(count / limit),
                totalRows: count,
            },
        });
    }

    async getUserCardsHandler(req: Request, res: Response) {
        const { user } = res.locals;

        const limit = Number(get(req.query, 'limit', '10'));
        const page = Number(get(req.query, 'page', '1'));

        if (isNaN(limit)) throw new ApplicationError('Type of limit is not number', 400);
        if (isNaN(page)) throw new ApplicationError('Type of page is not number', 400);

        const offset = (page - 1) * limit;

        const { rows: cards, count } = await this.repo.card.Model.findAndCountAll({
            where: {
                userId: user?.id,
            },
            attributes: {
                exclude: ['userId', 'verificationToken', 'squareCardId', 'metadata', 'deletedAt'],
            },
            limit,
            offset,
        });

        return res.status(200).json({
            status: true,
            message: 'User Card/s retrieved!',
            data: cards,
            pagination: {
                limit,
                currentPage: page,
                offset,
                totalPages: Math.ceil(count / limit),
                totalRows: count,
            },
        });
    }
}
