# Payment Gateway Using Square API

## Project Overview

-   **Technology Stack**: NodeJS, TypeScript, ExpressJS
-   **Database**: PostgreSQL

## Environment Configuration

Create a `.env` file with the following variables:
| **Variable** | **Required** | **Description** | **Default** |
|-----------------------|--------------|-------------------------------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection URL | - |
| `SQUARE_ACCESS_TOKEN` | Yes | Square Developer access token | - |
| `JWT_SECRET` | Yes | Secret key for JWT signing | - |
| `NODE_ENV` | No | Current environment | development |
| `PORT` | No | Server port | 7777 |
| `ACCESS_TOKEN_TTL` | No | Access token validity | 5m |
| `REFRESH_TOKEN_TTL` | No | Refresh token validity | 1y |

## Database Migrations

Migrations are managed using [Sequelize](https://sequelize.org/docs/v6)

-   Migration files are stored in `db/migrations`

### Migration Commands

Run pending migrations

```sh
npm run migrate:up
```

Revert last migration

```sh
npm run migrate:down
```

Revert all migrations

```sh
npm run migrate:down:all
```

## Testing

### Prerequisites

Run migrations before testing:

```sh
npm run migrate:up
```

### Running Tests

```sh
npm run test
```

-   Test files are located in the `__tests__` folder

## Resources

-   Server Instance: [https://payment-gateway-with-square.onrender.com](https://payment-gateway-with-square.onrender.com)
-   Swagger Documentation: [https://payment-gateway-with-square.onrender.com/api-docs](https://payment-gateway-with-square.onrender.com/api-docs)
-   Example UI: [https://payment-gateway-frontend-with-square.onrender.com](https://payment-gateway-frontend-with-square.onrender.com)
-   Square Sandbox Test Details: [https://developer.squareup.com/docs/devtools/sandbox/payments#card-not-present-success-state-values](https://developer.squareup.com/docs/devtools/sandbox/payments#card-not-present-success-state-values)

## Deployment

Detailed deployment instructions are available in [DEPLOYMENT.md](https://github.com/iamthe-nerdyDev/payment-processing-using-square/blob/main/DEPLOYMENT.md)

## Access & Refresh Token Flow

![](./diagrams/access-and-refresh-token-flow.png)
