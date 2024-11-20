import dotenv from 'dotenv';
dotenv.config();

let {
    NODE_ENV,
    PORT,
    DATABASE_URL,
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

if (!DATABASE_URL) throw 'DATABASE_URL missing in .env';

export default {
    IS_DEV,
    IS_PROD,
    NODE_ENV,
    PORT: Number(PORT),
    DATABASE_URL,
    JWT_SECRET,
    ACCESS_TOKEN_TTL,
    REFRESH_TOKEN_TTL,
    SQUARE_ACCESS_TOKEN,
};
