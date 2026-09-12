FROM node:22-alpine AS build

WORKDIR /web

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# nginx
FROM nginx:alpine

COPY --from=build /web/dist /usr/share/nginx/html

EXPOSE 80

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]