FROM node:22-alpine

WORKDIR /var/www/api

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "app.js"]