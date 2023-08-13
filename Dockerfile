# Base image
FROM node:16.15-alpine3.16

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

RUN apk add openssl && \
    apk add openssl-dev && \
    apk add libc6-compat && \
    rm -rf /var/cache/apk/*

RUN npm run prisma:generate
COPY prisma ./prisma/

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the app's port
EXPOSE 3000

# Use 'entrypoint' to run the script at container startup
ENTRYPOINT ["sh", "-c", "sleep 15 && node dist/main.js && npm run prisma:migrate && sleep 15 && npm run prisma:push"]