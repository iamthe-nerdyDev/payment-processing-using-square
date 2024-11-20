FROM node:20.9.0

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run migrate:up

RUN npm run build

EXPOSE 10000

CMD ["npm", "run", "start"]