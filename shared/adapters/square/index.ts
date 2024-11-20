import Env from '../../env';
import { Client, Environment } from 'square';
import Logger from '../../helpers/logger';

const { SQUARE_ACCESS_TOKEN } = Env;
if (!SQUARE_ACCESS_TOKEN) throw 'SQUARE_ACCESS_TOKEN is missing in .env';

const DEFUALT_SQUARE_ACCESS_TOKEN = 'xxxx-xxxx-xxxx-xxxx';
if (SQUARE_ACCESS_TOKEN === DEFUALT_SQUARE_ACCESS_TOKEN) {
    const msg = `SQUARE_ACCESS_TOKEN is still in default "${DEFUALT_SQUARE_ACCESS_TOKEN}", not updating this will cause the application to break`;
    Logger.warning(msg);
}

const client = new Client({
    environment: Environment.Sandbox,
    squareVersion: '2024-10-17',
    bearerAuthCredentials: {
        accessToken: SQUARE_ACCESS_TOKEN,
    },
});

export default client;
