import Env from '../../env';
import { Client, Environment } from 'square';

const { SQUARE_ACCESS_TOKEN } = Env;
if (!SQUARE_ACCESS_TOKEN) throw 'SQUARE_ACCESS_TOKEN is missing in .env';

const client = new Client({
    environment: Environment.Sandbox,
    squareVersion: '2024-10-17',
    bearerAuthCredentials: {
        accessToken: SQUARE_ACCESS_TOKEN,
    },
});

export default client;
