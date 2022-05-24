FROM node:12-slim
# node:alphine

# WORKDIR /usr/src/app
WORKDIR /usr/app

# COPY package*.json ./
# COPY ./package-lock.json ./
COPY . .
RUN npm install



EXPOSE 3000

CMD [ "npm", "start" ]