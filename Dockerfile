FROM node:20-alpine

WORKDIR /usr/src/app

ENV TZ=Asia/Bangkok

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json ./
COPY next.config.js ./

RUN npm config set registry https://lib.matador.ais.co.th/repository/npm/
RUN npm install

ADD . /usr/src/app
RUN mv .env.{BRANCH} .env

RUN npm run build

CMD ["npm","run","start"]

