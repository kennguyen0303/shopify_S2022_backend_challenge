FROM node:14-alpine 
WORKDIR /home/node/app/backend
COPY package*.json ./
COPY tsconfig.json .
RUN npm ci
