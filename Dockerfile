# Base Image
FROM node:16-alpine

RUN apk add --update --no-cache python3 gcc g++ make

RUN mkdir -p /app
WORKDIR /app

ADD ./package.json /app/
ADD . /app/

RUN yarn install
RUN yarn build

CMD yarn start