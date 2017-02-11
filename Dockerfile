FROM mhart/alpine-node:6

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json /usr/app/package.json
COPY config/production.env /usr/app/.env
COPY src /usr/app/src
COPY config /usr/app/config
COPY server /usr/app/server
COPY public /usr/app/public

RUN apk add --update make gcc g++ python git

RUN npm install  && \
    npm run build  && \
    npm prune --production && \
    npm uninstall -g npm

RUN apk del make gcc g++ python git && \
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

VOLUME /usr/app/server/uploads

EXPOSE 80
CMD ["node", "server/start"]
