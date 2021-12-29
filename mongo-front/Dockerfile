FROM node:16-alpine as build
WORKDIR /usr/local/app
COPY ./ /usr/local/app/
RUN npm install
RUN npm run build
RUN npm install @angular/material --save

FROM nginx:latest
COPY --from=build /usr/local/app/dist/mongo-front /usr/share/nginx/html
