import dotenv from 'dotenv';
dotenv.config();

let {
    NODE_ENV,
    PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    DATABASE_HOST,
    DATABASE_PORT,
    JWT_SECRET,
    ACCESS_TOKEN_TTL,
    REFRESH_TOKEN_TTL,
    SQUARE_ACCESS_TOKEN,
} = process.env;

NODE_ENV = NODE_ENV || 'development';

const IS_PROD = NODE_ENV === 'production';
const IS_DEV = NODE_ENV === 'development';

PORT = PORT || '7777';
JWT_SECRET = JWT_SECRET || 'something_super_secret';
ACCESS_TOKEN_TTL = ACCESS_TOKEN_TTL || '5m';
REFRESH_TOKEN_TTL = REFRESH_TOKEN_TTL || '1y';

if (!DATABASE_USERNAME) throw 'DATABASE_USERNAME missing in .env';
if (!DATABASE_PASSWORD) throw 'DATABASE_PASSWORD missing in .env';
if (!DATABASE_NAME) throw 'DATABASE_NAME missing in .env';
if (!DATABASE_HOST) throw 'DATABASE_HOST missing in .env';
if (!DATABASE_PORT) throw 'DATABASE_PORT missing in .env';

const DATABASE_URL = `postgres://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

export default {
    IS_DEV,
    IS_PROD,
    NODE_ENV,
    PORT: Number(PORT),
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_URL,
    JWT_SECRET,
    ACCESS_TOKEN_TTL,
    REFRESH_TOKEN_TTL,
    SQUARE_ACCESS_TOKEN,
};
