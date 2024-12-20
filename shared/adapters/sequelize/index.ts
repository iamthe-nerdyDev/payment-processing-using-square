import { Sequelize } from 'sequelize';
import Env from '../../env';
import Logger from '../../helpers/logger';

export = new Sequelize(Env.DATABASE_URL, {
    dialect: 'postgres',
    logging: Env.IS_TEST
        ? false
        : (sql, timing) => {
              Logger.info({
                  instance: (timing as any).instance,
                  sql: sql.toString(),
              });
          },
});
