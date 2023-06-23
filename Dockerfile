FROM node:18-alpine as builder

RUN apk update && apk add git openssh

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --network-concurrency 1 --ignore-scripts --frozen-lockfile
COPY . ./

ARG NEXT_PUBLIC_CALL_SOCKET
ARG NEXT_PUBLIC_CHAT_SOCKET
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_HOST

ENV NEXT_PUBLIC_CALL_SOCKET=$NEXT_PUBLIC_CALL_SOCKET
ENV NEXT_PUBLIC_CHAT_SOCKET=$NEXT_PUBLIC_CHAT_SOCKET
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_HOST=$NEXT_PUBLIC_HOST

RUN yarn build 

EXPOSE 3000
CMD ["yarn", "start"]

