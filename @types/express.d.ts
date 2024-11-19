import * as express from 'express';
import { UserOuput } from '../models/user';

declare module 'express' {
    interface Response {
        locals: {
            user?: UserOuput;
            session_id?: number;
        };
    }
}

export = express;
