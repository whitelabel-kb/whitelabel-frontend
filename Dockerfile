FROM node:8.9.4

ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /app

WORKDIR /app

COPY . /app

RUN npm install

RUN cp env.default .env

RUN npm run build

EXPOSE 7001

CMD npm run production
