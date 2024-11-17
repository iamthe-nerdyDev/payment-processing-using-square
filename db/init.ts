import Env from '../shared/env';
import { Card, User } from './models';

export default function dbInit() {
    User.sync({ alter: Env.IS_DEV });
    Card.sync({ alter: Env.IS_DEV });
}
