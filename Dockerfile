# Base image
FROM node:16.15-alpine3.16

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY wait-for-it.sh ./
RUN chmod +x ./wait-for-it.sh

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

RUN apk add openssl && \
    apk add openssl-dev && \
    apk add libc6-compat && \
    rm -rf /var/cache/apk/* && \
    apk add --no-cache bash

RUN npm run prisma:generate
COPY prisma ./prisma/

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the app's port
EXPOSE 3000

# Use 'entrypoint' to run the script at container startup
ENTRYPOINT ["sh", "-c", "\
    ./wait-for-it.sh postgres:5432 -t 0 -- npm run prisma:migrate && \
    npm run prisma:push && \
    node dist/main.js & \
    wait $!"]