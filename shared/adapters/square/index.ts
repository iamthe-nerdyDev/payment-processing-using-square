import Env from '../../env';
import { Client, Environment, ApiError } from 'square';

const { IS_PROD, SQUARE_ACCESS_TOKEN } = Env;
if (!SQUARE_ACCESS_TOKEN) throw 'SQUARE_ACCESS_TOKEN is missing in .env';

const client = new Client({
    environment: IS_PROD ? Environment.Production : Environment.Sandbox,
    squareVersion: '2024-10-17',
    bearerAuthCredentials: {
        accessToken: SQUARE_ACCESS_TOKEN,
    },
});

export default client;
