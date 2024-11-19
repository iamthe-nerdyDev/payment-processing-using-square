import { Request, Response } from 'express';
import { SessionRepo } from '../../repos';
import ApplicationError from '../../shared/helpers/applicationError';

export default class SessionController {
    constructor(private sessionRepo = new SessionRepo()) {}

    async getCurrentSessionInfoHandler(_: Request, res: Response) {
        const { session_id } = res.locals;

        const session = await this.sessionRepo.Model.findByPk(session_id, {
            attributes: {
                exclude: ['userId', 'metadata', 'deletedAt'],
            },
        });

        if (!session) throw new ApplicationError('Session not found', 404);

        return res.status(200).json({
            status: true,
            message: 'Session retrieved!',
            data: session.toJSON(),
        });
    }

    async logoutHandler(_: Request, res: Response) {
        const { session_id } = res.locals;

        const session = await this.sessionRepo.Model.findByPk(session_id);
        if (!session) throw new ApplicationError('Session not found', 404);

        await session.update({ isActive: false });

        return res.status(200).json({
            status: true,
            message: 'Logged out successfully!',
        });
    }
}
