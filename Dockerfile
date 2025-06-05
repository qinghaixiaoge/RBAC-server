FROM node:18-alpine
LABEL name="demo"
LABEL version="1.0"
COPY . /app
WORKDIR /app
RUN npm i
EXPOSE 3000
CMD npm run prod
