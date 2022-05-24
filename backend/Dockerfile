FROM node:lts-alpine

# node:12-slim   
# node:alphine

# WORKDIR C:\Users\Faithful\Documents\Javascript Projects\myMemoAppDocker\backend
# WORKDIR /usr/src/app
WORKDIR /usr/app
# WORKDIR '/app/backend'

# COPY package*.json ./
# COPY ./package-lock.json ./
COPY . .

RUN npm install



EXPOSE 8000


CMD [ "npm", "start" ]