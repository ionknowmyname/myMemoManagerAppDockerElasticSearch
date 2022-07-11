FROM node:lts-alpine

# node:12-slim   
# node:alphine

# WORKDIR C:\Users\Faithful\Documents\Javascript Projects\myMemoAppDocker\backend
# WORKDIR /usr/src/app
WORKDIR /usr/app
# WORKDIR '/app/backend'

COPY package*.json ./usr/app
# COPY ./package-lock.json ./

COPY . /usr/app

RUN npm install

EXPOSE 8000

# CMD [ "npm", "start" ]

CMD [ "node", "server.js" ]