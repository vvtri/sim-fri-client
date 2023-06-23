FROM node:18-alpine as builder

WORKDIR /usr/src/app
COPY package.json ./

RUN npm install
COPY . ./

RUN yarn build 

EXPOSE 5000
CMD ["yarn", "start"]

