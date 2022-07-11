FROM node:16-slim
# node:alphine
# node:17-alpine


# WORKDIR /usr/src/app
WORKDIR /usr/app/front

COPY package*.json ./usr/app/front
# COPY ./package-lock.json ./
COPY . .

RUN npm install



EXPOSE 3000


CMD [ "npm", "start" ]

