FROM node:13.6.0

WORKDIR /web-application/

COPY package*.json ./

RUN npm install

COPY src src

CMD ["npm","run","startapi"]