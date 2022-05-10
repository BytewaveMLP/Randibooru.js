FROM node:12

USER node
WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile --production && yarn cache clean

COPY . ./

CMD ["node", "./src/randibooru.js"]
