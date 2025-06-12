# Stage 1: Build the Angular app
FROM node:20 AS build
WORKDIR /dist/src/app

RUN npm cache clean --force
COPY . .
RUN npm install
RUN npm run build --configuration=production

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build dist/src/app/dist/FileSimplifier/browser   /usr/share/nginx/html/
COPY /nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
