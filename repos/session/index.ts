import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { Session } from '../../models';
import Env from '../../shared/env';
import { get } from 'lodash';
import { SessionInput } from '../../models/session';
import ApplicationError from '../../shared/helpers/applicationError';

export default class SessionRepo {
    constructor(public Model = Session) {}

    async newSession(payload: SessionInput) {
        return await this.Model.create(payload);
    }

    async deactivateSession(id: number) {
        const session = await this.Model.findByPk(id);
        if (!session) throw new ApplicationError('Session not found', 404);

        await session.update({ isActive: false });
        return session;
    }

    signJWT(object: Object, type: 'access' | 'refresh', extraOptions?: jwt.SignOptions) {
        const options = {
            expiresIn: type === 'access' ? Env.ACCESS_TOKEN_TTL : Env.REFRESH_TOKEN_TTL,
            ...extraOptions,
        };

        return jwt.sign(object, Env.JWT_SECRET, {
            ...(options || {}),
            algorithm: 'HS256',
        });
    }

    verifyJWT(token: string) {
        try {
            const decoded = jwt.verify(token, Env.JWT_SECRET) as jwt.JwtPayload;
            if (!decoded) return { valid: false };

            const currentTime = Math.floor(new Date().getTime() / 1000);

            if (get(decoded, 'exp')! <= currentTime) {
                return {
                    valid: false,
                    expired: true,
                };
            }

            return {
                valid: true,
                expired: false,
                decoded,
            };
        } catch (e: any) {
            if (e instanceof TokenExpiredError) {
                return {
                    valid: false,
                    expired: true,
                };
            }

            return {
                valid: false,
                expired: false,
            };
        }
    }

    async reIssueAccessToken(refreshToken: string) {
        const { decoded } = this.verifyJWT(refreshToken);

        if (!decoded || !get(decoded.data, 'session_id') || !get(decoded.data, 'user_id')) {
            return false;
        }

        const { user_id, session_id } = decoded.data;
        const session = await this.Model.findOne({
            where: { id: session_id, userId: user_id, isActive: true },
        });

        if (!session) return;
        return this.signJWT({ data: { user_id, session_id } }, 'access');
    }
}
