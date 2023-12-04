# Node version. The app was designed to run in the Node v20.10.0
FROM node:20-alpine

# Install Chromium for Puppeteer
RUN RUN apk add --update chromium

# Remove cache
RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# WORKDIR
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
