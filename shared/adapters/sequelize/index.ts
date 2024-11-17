import { Sequelize } from 'sequelize';
import Env from '../../env';

export = new Sequelize(Env.DATABASE_URL);
