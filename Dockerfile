FROM mhart/alpine-node:6

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN mkdir -p /usr/app
WORKDIR /usr/app

ADD . /usr/app

RUN apk add --update make gcc g++ python && \
    npm install  && \
    npm run build  && \
    npm prune --production && \
    npm uninstall -g npm && \
    apk del make gcc g++ python && \
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

EXPOSE 80
CMD ["node", "server/start"]
