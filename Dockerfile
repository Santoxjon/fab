# Node version. The app was designed to run in the Node v20.10.0
FROM node:20

# Install Chromium for Puppeteer
RUN apt update && apt install chromium -y

# WORKDIR
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
