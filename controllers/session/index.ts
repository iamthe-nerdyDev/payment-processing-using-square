import { Request, Response } from 'express';
import baseRepo from '../../repos';
import ApplicationError from '../../shared/helpers/applicationError';

export default class SessionController {
    constructor(private repo = baseRepo) {}

    async getCurrentSessionInfoHandler(_: Request, res: Response) {
        const { session_id } = res.locals;

        const session = await this.repo.session.Model.findByPk(session_id, {
            attributes: {
                exclude: ['userId', 'metadata', 'deletedAt'],
            },
        });

        return res.status(200).json({
            status: true,
            message: 'Session retrieved!',
            data: session?.toJSON(),
        });
    }

    async logoutHandler(_: Request, res: Response) {
        const { session_id } = res.locals;

        const session = await this.repo.session.Model.findByPk(session_id);
        await session?.update({ isActive: false });

        return res.status(200).json({
            status: true,
            message: 'Logged out successfully!',
        });
    }
}
