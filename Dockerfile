FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --only=prod

COPY dist dist

EXPORT 5000

CMD [ "npm start" ]
