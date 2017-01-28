FROM mhart/alpine-node:6

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json /usr/app/package.json
COPY .env.production /usr/app/.env
ADD src /usr/app/src
ADD config /usr/app/config
ADD server /usr/app/server
ADD public /usr/app/public

RUN apk add --update make gcc g++ python git

RUN npm install  && \
    npm run build  && \
    npm prune --production && \
    npm uninstall -g npm

RUN apk del make gcc g++ python git && \
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

EXPOSE 80
CMD ["node", "server/start"]
